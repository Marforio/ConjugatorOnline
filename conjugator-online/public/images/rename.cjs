const fs = require('fs');
const path = require('path');

// Folder is in the same directory as this script
const folderPath = path.join(__dirname, 'quant_pics_resized');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error reading folder:', err);
    return;
  }

  files.forEach((file) => {
    if (file.includes('%')) {
      const oldPath = path.join(folderPath, file);
      const newFileName = file.replace(/%/g, ''); // remove all '%' symbols
      const newPath = path.join(folderPath, newFileName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`Failed to rename ${file}:`, err);
        } else {
          console.log(`Renamed: ${file} → ${newFileName}`);
        }
      });
    }
  });
});
