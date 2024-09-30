import axios from "axios";

import { fileURLToPath } from "url";
import { join, dirname } from "path";
import fs from "fs";

/**
 * pixiv.net search by tags
 * @param {string} tags the keyword
 * @param {boolean} save save locally or send the array of img url
 * @returns
 */
const pixiv = async function (tags, save = false) {
  const { data } = await axios({
    validateStatus: () => true,
    baseURL: "https://www.pixiv.net/",
    url: `/ajax/search/top/${tags}`,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    },
    responseType: "json",
  });
  if (data.error) return { message: data.message };
  const result = Object.values(data.body).filter((obj) => obj.total);
  if (save) {
    const filePath = join(
      dirname(fileURLToPath(import.meta.url)),
      "..",
      "tmp", // for reference (can be changed)
      `${Date.now().toString()}.jpg`
    );
    const pickRandomUrl = () => {
      const data = result[0].data.map((v) =>
        v.url.replace("c/250x250_80_a2/", "").replace("square", "master")
      );
      return data[Math.floor(data.length * Math.random())];
    };
    const { data } = await axios({
      validateStatus: () => true,
      url: pickRandomUrl(),
      headers: {
        Referer: "https://www.pixiv.net/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
    fs.writeFileSync(filePath, data);
    return { result: filePath };
  } else
    return {
      result: result[0].data.map((v) =>
        v.url.replace("c/250x250_80_a2/", "").replace("square", "master")
      ),
    };
};

export { pixiv };
