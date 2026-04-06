const fs = require('fs');
const path = require('path');

const walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

const frontendSrcPath = path.join(process.cwd(), "Frontend", "src");

walk(frontendSrcPath, (err, files) => {
  if (err) throw err;
  let count = 0;
  for (const file of files) {
    if (file.endsWith(".jsx") || file.endsWith(".js") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      let content = fs.readFileSync(file, "utf8");
      let originalContent = content;
      
      // Replace the crazy fallback
      content = content.replace(/\(import\.meta\.env\.VITE_API_URL \|\| \(import\.meta\.env\.VITE_API_URL \|\| \`\\\$\{import\.meta\.env\.VITE_API_URL\}\`\)\) \+ "/g, '"');
      
      // Replace the template literal version
      content = content.replace(/\$\{import\.meta\.env\.VITE_API_URL \|\| \`\\\$\{import\.meta\.env\.VITE_API_URL\}\`\}/g, '');
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        count++;
        console.log("Updated: " + file);
      }
    }
  }
  console.log("Finished updating " + count + " files.");
});
