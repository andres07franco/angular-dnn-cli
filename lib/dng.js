var argv = require('optimist').argv, 
    fs = require('fs'),
    xml2js = require('xml2js'),
    cmd=require('node-cmd'),
    archiver = require('archiver'),    
    dnnfile = require('./dnnfilefactory');

var projects = [];
var command ;
var projectName;

main();

/**
 * Funcion de ejecucion principal
 */
function main()
{
    
    try
    {
        validateEnvironment();
        loadComands();

        if(command == 'build')
        {
            runCommandBuild();
        }
        else if(command == 'init')
        {
            runCommandInit();
        }  
    }catch(err) 
    {
        console.log(err);
    }
}

function validateEnvironment(){
    if(argv._.length == 0){
        console.log("No se ingreso ningun comando, consulte: dng --help");
        throw 0;
    }
   /* if(argv._.length == 1)
    { 
        console-log("No se ingreso nombre del proyecto, consulte: dng --help");   
        throw 0; 
    }*/
    if (!fs.existsSync('angular.json'))
    {
        console.log("No existe archivo 'angular.json'");   
        throw 0;  
    }
    if (argv._.length > 1 && !fs.existsSync("projects/"+argv._[1]))    {
        console.log("No existe directorio " + argv._[1] + " o el nombre del proyecto no coincide con el directorio");   
        throw 0;  
    }
}

function loadComands(){    
    if(argv._.length > 1)   projectName = argv._[1];
    command = argv._[0]   
}

/**
 * Crear un archivo dnn el el proyecto angular
 */
function runCommandInit(){
    
    if (argv._.length < 2 )    {
        console.log("No se especifico el nombre del proyecto");   
        throw 0;  
    }
    dnnfile.makeDnnFile(argv._[1]);
}

function runCommandBuild()
{
    var obj = JSON.parse(fs.readFileSync('angular.json', 'utf8'));    
   
    //quitando proyectos e2e
    Object.keys(obj.projects).forEach(function(element,index) {
       if(!isProuectE2E(element) && (!projectName || element == projectName ))
       {       
            projects.push({name:element,proj:obj.projects[element]});
       }
        
      });
      
      projects.forEach(function(element,index) {
          if(index == 0) console.log("Proyectos detectados: " )
          console.log("--> " + element.name);
      });

      projects.forEach(function(element,index) {
        if (!fs.existsSync("projects/"+element.name+"/"+ element.name + '.dnn'))
        {
            console.log("Proyecto " + element.name + " no posee archivo DNN");        
            throw 0;
        }
    });      
      
     if(projects.length > 0)  dngbuild(projects.pop());    
}

/**
 * Genera un un paquete instalable de dnn
 */
function dngbuild(element){  
    var buildCommand = 'ng build ' + element.name + (argv.prod?' --prod':'');
    console.log('Ejecutando '  + buildCommand);         
    cmd.get(
        buildCommand,
        function(err, data, stderr){
            console.log(data)
            if(err)
            {      
                console.log(err)          ;
                  throw 0               
            }
            
            if(!err)
            {
                loadProyect(element);
            }                
        }
    )
}



function isProuectE2E(element)
{
    var proyKeysSplit = element.split("-");
    if(proyKeysSplit[proyKeysSplit.length - 1] == 'e2e')
    {
       return true;
    }
    return false;
}

 

function loadProyect(element) {
        
    var moduleName = element.name;
    var outPutReourcesPath =  element.proj.architect.build.options.outputPath

    var parser = new xml2js.Parser();


    var dnnFile = fs.readFileSync("projects/"+moduleName+"/"+ moduleName + '.dnn');
    

    parser.parseString(dnnFile, function (err, result) {  

        var moduleNameDnn = result.dotnetnuke.packages[0].package[0].$.name;
        var resourceFileName = result.dotnetnuke.packages[0].package[0].components[0].component[0].resourceFiles[0].resourceFile[0].name[0];
        
        createResourcesZip(outPutReourcesPath,resourceFileName,moduleName);                            
    }); 
}

function createResourcesZip(outPutReourcesPath,resourceFileName,moduleName)
{   
    console.log('Creando dnnbuild'); 
    if (!fs.existsSync('dnnbuild')){        
        fs.mkdirSync('dnnbuild');
    }
    // create a file to stream archive data to.
    var output = fs.createWriteStream( 'dnnbuild/' + resourceFileName);
    var archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.directory(outPutReourcesPath , false);
    output.on('close', function() {        
        console.log(archive.pointer() + ' total bytes');
        console.log('Archivos de recurso emaquetados'); 
        createModuleZip(moduleName,resourceFileName);
      });   
    archive.finalize();
}

function createModuleZip(moduleName,resourceFileName)
{
    console.log('Creando ' + moduleName + '.zip'); 
    var output = fs.createWriteStream( 'dnnbuild/' + moduleName + '_DnnInstall.zip');
    var archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.file('dnnbuild/'+resourceFileName, { name: (resourceFileName+"").replace(".zip","") + '.zip' });
    archive.file("projects/"+moduleName+"/"+ moduleName + '.dnn', { name: moduleName + '.dnn' });
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('Creando paquete instalable de DNN'); 
        fs.unlink('dnnbuild/'+resourceFileName, (err) => {      
            if (err) throw err;
        });
      });    
    archive.finalize();

    if(projects.length > 0)  dngbuild(projects.pop());  
}