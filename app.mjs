import axios from "axios";
import path from "path";
import { promises as fs } from "fs";
import { setWallpaper } from "wallpaper";

const downloadImage = async (url) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  const filePath = path.resolve("./images/wallpaper.jpg");
  await fs.writeFile(filePath, buffer);
  return filePath;
};

const getImage = async () => {
  const subs = [
    "EarthPorn",
    "ExposurePorn",
    "ImaginaryLandscapes",
    "lightpainting",
    "wallpaper",
    "wallpapers",
  ];
  const sub = process.argv[2] || subs[Math.floor(Math.random() * subs.length)];
  const url = `https://www.reddit.com/r/${sub}/.json`;
  console.log(`Fetching image from ${sub}`);

  try {
    const response = await axios.get(url);
    const posts = response.data.data.children;

    const imagePosts = posts.filter((post) => post.data.post_hint === "image");

    const randomImage = Math.floor(Math.random() * imagePosts.length);
    const randomImagePost = imagePosts[randomImage];

    if (randomImagePost) {
      const imageURL = randomImagePost.data.url;
      const downloadedImagePath = await downloadImage(imageURL);
      await setWallpaper(downloadedImagePath);
    } else {
      console.error("No images found");
    }
  } catch (error) {
    console.error("Failed to fetch data");
  }
};

getImage();
const time = process.argv[3] * 1000;
setInterval(getImage, time || 180000);
