var argv = require('optimist').argv, 
    fs = require('fs'),
    xml2js = require('xml2js'),
    cmd=require('node-cmd'),
    archiver = require('archiver');

// captura de comandos
var command = argv._[0];

main();

/**
 * Funcion de ejecucion principal
 */
function main()
{
    if(command == 'build')
    {
        console.log('Ejecutando ng build');        
        cmd.get(
            'ng build',
            function(err, data, stderr){
                console.log(data)
                if(err)  console.log('error :' + err);               
                
                if(!err)
                {
                    dngbuild();
                }                
            }
        );
    }
}

function dngbuild()
{
    var obj = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
    var moduleName = obj.defaultProject;
    var outPutReourcesPath = obj.projects[moduleName].architect.build.options.outputPath;

    var parser = new xml2js.Parser();
    var dnnFile = fs.readFileSync(moduleName + '.dnn')
    
    var moduleNameDnn;
    var resourceFileName;
    parser.parseString(dnnFile, function (err, result) {            
        moduleNameDnn = result.dotnetnuke.packages[0].package[0].$.name;
        resourceFileName = result.dotnetnuke.packages[0].package[0].components[0].component[0].resourceFiles[0].resourceFile[0].name[0];
     
        console.log('Limpiando dnnbuild'); 
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
    var output = fs.createWriteStream( 'dnnbuild/' + moduleName + '.zip');
    var archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.file('dnnbuild/'+resourceFileName, { name: (resourceFileName+"").replace(".zip","") + '.zip' });
    archive.file(moduleName + '.dnn', { name: moduleName + '.dnn' });
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('Creando paquete instalable de DNN'); 
        fs.unlink('dnnbuild/'+resourceFileName, (err) => {      
            if (err) throw err;
        });
      });    
    archive.finalize();


}

//angular.json
//nombre del modulo 
//nombre de la carpeta de los archivos generados por angular
//module.dnn
//nombre de como se llama el archivo zip de recursos

//ejecutar ng build | ng build --prod
// empaquetar  archivos en resourcesname.zip
// empaquetar archivos en modulename.zip




 

/**
 * Genera un archivo zip para instalar en dnn
 */
function buildDnnModule(){
    var parser = new xml2js.Parser();
    fs.readFile('demo.dnn', function(err, data) {
        parser.parseString(data, function (err, result) {
            
            //console.dir(result.dotnetnuke.packages[0].package[0].$.name);

            
            //Creando zip de resources
            createZipPackage(outBuildZipPath);
            
            //creando zip de moduloe dnn
            createZipPackage(outBuildZipPath)
            


            console.log('Done!');
        });
    });
}



/**
 * Genera un archivo Zip
 * @param {Ruta de paquete a generar} outPath 
 * @param {Ruta de archivos a empaquetar} inPath 
 * @param {Patron de selecion de archivos, si se manda vacio toma todos los archivos} fileNamePaterm 
 */
function createZipPackage(inPath,outPath,fileNamePaterm)
{

}


