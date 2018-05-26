var fs = require('fs');

/**
 *   Dnn file template
 */
var dnnfile=`<dotnetnuke type="Package" version="5.0">
<packages>
  <package name="_modulename_" type="Module" version="00.00.01">
    <friendlyName>_modulename_</friendlyName>
    <description>_modulename_</description>
    <azureCompatible>true</azureCompatible>
    <dependencies>
      <dependency type="CoreVersion">08.00.00</dependency>
    </dependencies>   
    <components>
      <component type="ResourceFile">
        <resourceFiles>
          <basePath>DesktopModules/_modulename_</basePath>
          <resourceFile>
            <name>Resources.zip</name>
          </resourceFile>
        </resourceFiles>
      </component>
      <component type="Module">
        <desktopModule>
          <moduleName>_modulename_</moduleName>
          <foldername>_modulename_</foldername>
          <supportedFeatures />
          <moduleDefinitions>
            <moduleDefinition>
              <friendlyName>_modulename_</friendlyName>
              <defaultCacheTime>0</defaultCacheTime>
              <moduleControls>
                <moduleControl>
                  <controlKey />
                  <controlSrc>DesktopModules/_modulename_/index.html</controlSrc>
                  <supportsPartialRendering>False</supportsPartialRendering>
                  <controlTitle />
                  <controlType>View</controlType>
                  <iconFile />
                  <helpUrl />
                  <viewOrder>0</viewOrder>
                </moduleControl>
              </moduleControls>
            </moduleDefinition>
          </moduleDefinitions>
        </desktopModule>
      </component>
    </components>
  </package>
</packages>
</dotnetnuke>`;

/**
 * Angular 6 projects loaded
 */
var projects = [];

/**
 * Create dnn file for a specific project name or fro all projects
 * @param {Project name} projectName 
 */
var buildDnnFiles = function (projectName)
{
  //validate angular 6 poject
  if (!fs.existsSync("angular.json"))
  {
    console.log("Project Angular 6 not found.");
    throw "";
  } 

  //Loading angular.json file
  var obj = JSON.parse(fs.readFileSync('angular.json', 'utf8'));  

  //remove  e2e projects
  Object.keys(obj.projects).forEach(function(element,index) {
      if(!isProuectE2E(element) && (!projectName || element == projectName ))
      {       
            projects.push({name:element,proj:obj.projects[element]});
      }      
  });

  projects.forEach(function(element,index) {


    if (element.proj.root != "" && !fs.existsSync(element.proj.root))
    {
        console.log("Project directory " + element.proj.root + " not found.");        
        throw "";
    }
  });  

  projects.forEach(function(element,index) {  
      if(index == 0) 
        console.log("Projects founds: " )
      console.log("--> " + element.name);

      //Update deployUrl
      obj.projects[element.name].architect.build.options.deployUrl = "/DesktopModules/"+element.name+"/";
  });  

  json = JSON.stringify(obj,null,"\t");

  fs.writeFile('angular.json', json, 'utf8', function(err){
    if (err)
      console.log(err);
    else
      console.log("Angular.json done!");

      buildDnnFileByProject(projects.pop()); 
    }); 
}

/**
 * Build dnn file by project
 * @param {Project} project 
 */
function buildDnnFileByProject(project)
{
  var fileContent =  dnnfile.replace(/_modulename_/g,project.name);
  console.log("Build " + project.proj.root + project.name +".dnn");
  fs.writeFile(project.proj.root +  project.name +".dnn", fileContent, (err) => {
    if (err){
      console.log(err);
      throw "";
    }
    if(projects.length > 0 )
       buildDnnFileByProject(projects.pop()); 
    else
      console.log(".dnn files done!.");
  });
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
module.exports.buildDnnFiles = buildDnnFiles;