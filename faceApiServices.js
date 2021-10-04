const path = require("path");
//const tf = require("@tensorflow/tfjs-node");
const canvas = require("canvas");
const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";

let optionsSSDMobileNet;

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function detect(tensor) {
  const result = await faceapi
    .detectAllFaces(tensor, optionsSSDMobileNet)
    .withFaceLandmarks()
    .withFaceDescriptors();
  return result;
}
async function main() {
  try {
    const SELFIE = "./r7.jpg";
    const MY_ID_CARD = "./id.jpg";
    const selfie = await canvas.loadImage(SELFIE);
    const my_id_card = await canvas.loadImage(MY_ID_CARD);
    const modelPath = path.join(__dirname, modelPathRoot);
    await Promise.all([
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath),
      await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
      await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    ]);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.5,
    });
    const result = await detect(my_id_card);
    const rahimFace = await faceapi
      .detectSingleFace(selfie)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const faceMatcher = new faceapi.FaceMatcher(rahimFace);
    result.map((res) => {
      const bestMatch = faceMatcher.findBestMatch(res.descriptor);
      console.log("bestMatch : " + bestMatch);
    });
    return result;
  } catch (error) {
    console.log("here new error");
    console.log(error);
  }
}

module.exports = {
  detect: main,
};
