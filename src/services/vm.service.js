const msRestAzure = require('ms-rest-azure');
const ComputeManagementClient = require('azure-arm-compute');
const NetworkManagementClient = require('azure-arm-network');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

// Define your Azure credentials
const clientId = config.azure.clientId;
const domain = config.azure.domain;
const secret = config.azure.secretKey;
const subscriptionId = config.azure.subscription;



async function deployVirtualMachine() {

    const vmName = '<your-vm-name>';
    const vmSize = 'Standard_DS1_v2';
    const adminUsername = '<your-admin-username>';
    const adminPassword = '<your-admin-password>';
    const nicName = '<your-nic-name>';
    const location = 'eastus';
    const resourceGroup = '<your-resource-group-name>';
    const vnetName = '<your-vnet-name>';
    const subnetName = '<your-subnet-name>';
    const imagePublisher = 'MicrosoftWindowsServer';
    const imageOffer = 'WindowsServer';
    const imageSku = '2019-Datacenter';
    try {
        // Authenticate with Azure
        const credentials = await msRestAzure.loginWithServicePrincipalSecret(clientId, secret, domain);
    
        // Create the Compute Management Client
        const computeClient = new ComputeManagementClient(credentials, subscriptionId);
    
        // Create the Network Management Client
        const networkClient = new NetworkManagementClient(credentials, subscriptionId);
        // Define the virtual network parameters
        const vnetParameters = {
            location: location,
            addressSpace: {
            addressPrefixes: ['10.0.0.0/16'],
            },
            subnets: [
            {
                name: subnetName,
                addressPrefix: '10.0.0.0/24',
            },
            ],
        };

        const vnetResult = await networkClient.virtualNetworks.createOrUpdate(resourceGroup, vnetName, vnetParameters);
        // Define the network interface parameters
    const nicParameters = {
        location: location,
        ipConfigurations: [
          {
            name: nicName,
            privateIpAllocationMethod: 'Dynamic',
            subnet: {
              id: vnetResult.subnets[0].id,
            },
          },
        ],
      };

      const nicResult = await networkClient.networkInterfaces.createOrUpdate(resourceGroup, nicName, nicParameters);

      // Define the virtual machine parameters
      const vmParameters = {
        location: location,
        osProfile: {
          computerName: vmName,
          adminUsername: adminUsername,
          adminPassword: adminPassword,
        },
        hardwareProfile: {
          vmSize: vmSize,
        },
        storageProfile: {
          imageReference: {
            publisher: imagePublisher,
            offer: imageOffer,
            sku: imageSku,
            version: 'latest',
          },
          osDisk: {
            name: `${vmName}_os_disk`,
            createOption: 'FromImage',
          },
        },
        networkProfile: {
          networkInterfaces: [
            {
              id: nicResult.id,
              primary: true,
            },
          ],
        },
      };
  
      // Create the virtual machine
      const vmResult = await computeClient.virtualMachines.createOrUpdate(resourceGroup, vmName, vmParameters);
  
      return `Virtual machine '${vmName}' created with public IP '${vmResult.networkProfile.networkInterfaces[0].ipConfigurations[0].publicIPAddress.id}'.`;
    } catch (err) {
      console.error(err);
      throw err;
    }

}