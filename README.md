# SmartHomeAutomation

## Getting Started

1. Sign up for an [IBM Cloud account](https://console.bluemix.net/registration/).
1. Download the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).
1. Download/clone the github folder.
1. In the application folder, copy the *.env.example* file and create a file called *.env*
    ```
    cp .env.example .env
    ```

## Create an IoT app in the IBM Cloud

1. Navigate to catalog and search for iot platfrom starter kit.
1. Enter a name for your application. Because this name is also used as the host name, it must be unique within the IBM Cloud.
1. Click Create.
1. After your app is created, in the left pane, click Overview. Notice that your app contains two connections, one to a Cloudant NoSQL database and another to an Internet of Things Platform service
1. In the Overview view of your app, under Connections, click the Internet of Things Platform service.
1. Click Launch to open the Watson IoT Platform dashboard
1. The IBM Watson IoT Platform dashboard is displayed, which is a service that is independent of the IBM Cloud. An organization ID is assigned to your app, and you will need this ID later when developing the app.
1. On the left menu, which pops out when you hover over it, click o Apps. 
1. Create an API key for standard application, copy the authentication key and token and paste it in the env file as shown below.
```
IOT_PLATFORM_ORG={your_organisation_id}
IOT_AUTH_KEY={iot_platform_authentication_key}
IOT_AUTH_TOKEN={iot_platform_authntication_token}
```

## Add a device that will send MQTT messages to the Watson IoT Platform

1. On the left menu, which pops out when you hover over it, click Devices. Then, click Add a device type. In your organization, you can have multiple device types each with multiple devices. A device type is a group of devices that share characteristics; for example, they might provide the same sensor data. In our case, the device type name must be “Motion” (this device type name is required by the app that you will use later). Enter the device ID. The device ID can be, for example, the MAC address of your smartphone. However, it must be unique within your organization only. For this application keep it '1234M'
2. Click Next. A page is displayed where you can enter metadata about the device type, such as a serial number or model. You don’t need to specify this information for this demo. Just click Done.
3. Provide a value for the authentication token or auto-generate it. Then, click Next. 
4. Create a device similarly with device type as Temperature and id as '1234T' which we will use for simulation of temperature.
5. Create anoter device with device type as Light and id as '1234L' which will be used to control the smart lights through the app.

## Simulate a device that will send MQTT messages to the Watson IoT Platform

1. On the left menu, click Settings and activate Device Simulator to be used by the app.
2. You will see a tab for simulation on the bottom right. Click on that.
3. Click on new simulation.
4. Select the device type that we created before for temperature
5. Schedule the event based on your preference.
6. Add a payload to simulate temperature as follows
```
{
  "randomNumber": random(20, 50)
}
```
7. Click save.
8. Click use regsitered device and select the device id. In this case it will be '1234T'
9. You should be able  to see the published events under the device type.

## Create an instance of Visual Recongnition Service

1. Navigate to the catalog and search for Visual Recognition under watson services.
2. Create an instance of the same.
3. On the left menu, navigate to service credentials and create new credentials.
4. copy the apikey and paste it in the env file for the visual recognition server as shown below
```
VISUAL_RECOGNITION_IAM_APIKEY={your_visual_recognition_key}
```
## Create the node red flow for a dashboard

In this section, you will enhance your IBM Cloud IoT app by using a Node-RED flow to process messages from the devices and then visualize it on a dashboard.

1. Open your IBM Cloud dashboard
2. In your IBM Cloud dashboard, verify that your IBM Cloud IoT app is up and running.
3. In a browser, open .mybluemix.net, where is the name for your IoT app. Follow the wizard steps to set a user name and password for the Node-RED editor.
4. On the Node-RED page for your IoT app, click Go to your Node-RED flow editor. The editor opens, containing a sample flow. 
5. Using the drag-and-drop features of this editor, you can plug together a flow of messages. Although you can create your own flow here, we will import the code below. But first, select all existing nodes, and delete them by pressing the Delete key.
6. Click on the settings icon on the top right corner. 
7. Click on Manage Pallete and then Install.
8. Search for node-red-dashboard and install it. 
9. Download the text file (nodeRedCode.txt) from the githib folder.
10. Open the file in a text editor. Make sure that all the code is on a single line. Remove any line breaks. Copy the line of code.
11. In the Node-RED editor, press Ctrl-I to open the Import Nodes dialog. Paste the code, and click OK. 
12. Double click on the IBM IOT App In and make sure the autehentication is set to bluemix service and configure it to listen from all types of device for all events.
13. Double click on the IBM IOT and make sure the autehentication is set to bluemix service.
14. Click Deploy in the flow editor. The flow is deployed and should be active immediately.
15. Click on the dashboard icon placed just below the Deploy button.
16. Click on the new tab icon and you will see the dashboard opening up in a new tab.
17. You will see the temperature data being visualized using the guage. 

## Running locally

1. Install the dependencies

    ```
    npm install
    ```

1. Run the application

    ```
    npm start
    ```

1. View the application in a browser at `localhost:8080`


## Deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).

    ```
    ibmcloud login
    ```

1. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

1. Edit the *manifest.yml* file. Change the **name** field to something unique.  
  For example, `- name: my-app-name`.
  
1. Deploy the application.

    ```
    ibmcloud cf push
    ```

1. View the application online at the app URL on a pc.  
For example: https://my-app-name.mybluemix.net

1. The front camera will take picture every 15 seconds and if a person is detected, you will be notified on your node red dashboard. You can use the switch on the dashboard to send commands to the pc to switch on/off the lights.

1. Visit the application url for motion sensor at : https://my-app-name.mybluemix.net/motion from the device that has the sensor. For example your smart phone. You will be able to see the motion changes in a graph on the dashboard. 


