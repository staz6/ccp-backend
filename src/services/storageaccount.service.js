const msRestAzure = require('ms-rest-azure');
const { DefaultAzureCredential, ClientSecretCredential } = require("@azure/identity");
const { ResourceManagementClient } = require("@azure/arm-resources");
const { StorageManagementClient } = require("@azure/arm-storage");
const { BlobServiceClient } = require("@azure/storage-blob");
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const config = require("../config/config");

const clientId = config.azure.clientId;
const domain = config.azure.domain;
const clientSecret = config.azure.secretKey;
const tenantId = config.azure.tenantId
const subscriptionId = config.azure.subscription;


const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
const resourceClient = new ResourceManagementClient(credential, subscriptionId);
const storageClient = new StorageManagementClient(credential, subscriptionId);


const deleteResource = async (resourceGroupName,accountName)=>{
  try {
    await storageClient.storageAccounts.beginDeleteMethod(resourceGroupName, accountName);
    console.log(`Storage account "${accountName}" deleted successfully.`);
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
}

const listFiles = async (resourceGroupName,accountName) => {
  try{
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credential
    );
    const containerName = `${resourceGroupName}-container`.toLowerCase();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobs = [];
    let marker = undefined;
  
    do {
      const listBlobsResponse = await containerClient.listBlobFlatSegment(marker);
      marker = listBlobsResponse.nextMarker;
      blobs.push(...listBlobsResponse.segment.blobItems);
    } while (marker);
  
    const fileInfos = await Promise.all(blobs.map(async (blob) => {
      const blobClient = containerClient.getBlobClient(blob.name);
      const properties = await blobClient.getProperties();
      const contentType = properties.contentType;
      const contentLength = properties.contentLength / 1024; 
      const lastModified = properties.lastModified;
      const blobUrl = blobClient.url;
      
      return {
        name: blob.name,
        type: contentType,
        size: contentLength,
        uploadDate: lastModified,
        link: blobUrl
      };
    }));
  
    return fileInfos;
  }catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }

}

const uploadFile = async(resourceGroupName,accountName,file) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    credential
  );
  const containerName = `${resourceGroupName}-container`.toLowerCase();
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(file.originalname);
  const fileContent = file.buffer;

  try {
    const response = await containerClient.exists();
    if (response === false) {
      console.log(`Container "${containerName}" does not exist, creating new container.`);
      await containerClient.create({access: "blob",});
    } 
    await blockBlobClient.uploadData(fileContent);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
}


const deploy = async (organizationName,storageAccountName) => {

    const resourceGroupName = organizationName;
  const accountName = `${storageAccountName}${Math.floor(100000 + Math.random() * 900000)}`;
  // Check if the resource group exists, and create it if it doesn't exist
  var resourceGroup = null;
  try{
    resourceGroup = await resourceClient.resourceGroups.get(resourceGroupName);
    console.log('resource group doesnt exist')
  }catch(err){
    resourceGroup = await resourceClient.resourceGroups.createOrUpdate(resourceGroupName, {
        location: "eastus",
      });
      console.log(`Resource group '${resourceGroupName}' created successfully.`);
  }
  

  // Deploy the storage account to the resource group
  const storageAccountParameters = {
    location: "eastus",
    kind: "StorageV2",
    sku: {
      name: "Standard_LRS",
    },
  };

  try {
    const result = await storageClient.storageAccounts.beginCreateAndWait(
      resourceGroupName,
      accountName,
      storageAccountParameters
    );
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
}

module.exports={
    deploy,
    deleteResource,
    uploadFile,
    listFiles
}