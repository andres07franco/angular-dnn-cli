var dnnfile=`<dotnetnuke type="Package" version="5.0">
<packages>
  <package name="Demo" type="Module" version="00.00.01">
    <friendlyName>#modulename#</friendlyName>
    <description>#modulename#</description>
    <azureCompatible>true</azureCompatible>
    <dependencies>
      <dependency type="CoreVersion">08.00.00</dependency>
    </dependencies>
    
    <components>
      <component type="ResourceFile">
        <resourceFiles>
          <basePath>DesktopModules/#modulename#</basePath>
          <resourceFile>
            <name>Resources.zip</name>
          </resourceFile>
        </resourceFiles>
      </component>

      <component type="Module">
        <desktopModule>
          <moduleName>#modulename#</moduleName>
          <foldername>#modulename#</foldername>
          <supportedFeatures />
          <moduleDefinitions>
            <moduleDefinition>
              <friendlyName>#modulename#</friendlyName>
              <defaultCacheTime>0</defaultCacheTime>
              <moduleControls>
                <moduleControl>
                  <controlKey />
                  <controlSrc>DesktopModules/#modulename#/index.html</controlSrc>
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


var makeDnnFile = function (modulename)
{
   return dnnfile.replace("#modulename#",modulename);
}