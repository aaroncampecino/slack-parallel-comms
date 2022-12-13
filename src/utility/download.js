const fs = require("fs");
const https = require("https");
const path = require("path");

const PATH = `${__dirname}/files/`;

export const download = async (files, user) => {
  const token = user.bot.token;
  // for await (const file of files) {
  //   downloadFile(file.url_private_download, token, file.name);
  // }

  const status = await Promise.all(
    files.map((file) =>
      downloadFile(file.url_private_download, token, file.name)
    )
  );

  console.log("Status =>", status);
};

export const downloadFile = (url, token, filename) => {
  return new Promise(async (resolve, reject) => {
    const options = {
      method: "GET",
      hostname: "files.slack.com",
      path: url.replace("https://files.slack.com", ""),
      rejectUnauthorized: "false",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      if (!fs.existsSync(PATH)) {
        fs.mkdirSync(PATH);
      }

      const req = https.request(options, (res) => {
        // Image will be stored at this path
        const path = `${PATH}${filename}`;
        const filePath = fs.createWriteStream(path);
        res.pipe(filePath);
        filePath.on("finish", () => {
          filePath.close();
          console.log("Download Completed");
        });
      });

      req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      req.end();
    } catch (error) {
      console.error(error);
    }

    setTimeout(() => {
      resolve(`Download Completed...`);
    }, 2000);
  });
};

export const deleteFile = () => {
  const dirContents = fs.readdirSync(PATH); // List dir content

  for (const fileOrDirPath of dirContents) {
    try {
      // Get Full path
      const fullPath = path.join(PATH, fileOrDirPath);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // It's a sub directory
        if (fs.readdirSync(fullPath).length) emptyDir(fullPath);
        // If the dir is not empty then remove it's contents too(recursively)
        fs.rmdirSync(fullPath);
      } else fs.unlinkSync(fullPath); // It's a file
    } catch (ex) {
      console.error(ex.message);
    }
  }
};
