var fs = require('fs');

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



 
var makeDnnFile = function (projectname)
{
  var fileContent =  dnnfile.replace(/_modulename_/g,projectname);
  if (!fs.existsSync("projects/" + projectname))
  {
    console.log("no existe proyecto " + projectname);
    throw "";
  }
  fs.writeFile("projects/" + projectname + '/' +  projectname+".dnn", fileContent, (err) => {
    if (err) throw err;
    console.log("Proyecto dnn iniciado!");
  });

}
module.exports.makeDnnFile = makeDnnFile;