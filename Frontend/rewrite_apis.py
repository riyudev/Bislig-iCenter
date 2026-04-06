import os
import re

def rewrite_files():
    frontend_src = os.path.join(os.getcwd(), 'Frontend', 'src')
    
    # Regex 1: (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`)) + "/api
    pattern1 = re.compile(r'\(\s*import\.meta\.env\.VITE_API_URL\s*\|\|\s*\(\s*import\.meta\.env\.VITE_API_URL\s*\|\|\s*`\$\{import\.meta\.env\.VITE_API_URL\}`\s*\)\s*\)\s*\+\s*"')
    
    # Regex 2: `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`}/api
    pattern2 = re.compile(r'`\$\{import\.meta\.env\.VITE_API_URL\s*\|\|\s*`\$\{import\.meta\.env\.VITE_API_URL\}`\s*\}/')
    
    # Regex 3: (import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`)) + "/api
    pattern3 = re.compile(r'\(\s*import\.meta\.env\.VITE_API_URL\s*\|\|\s*\(\s*import\.meta\.env\.VITE_API_URL\s*\|\|\s*`\\\$\{import\.meta\.env\.VITE_API_URL\}`\s*\)\s*\)\s*\+\s*"')

    # Regex 4: `${import.meta.env.VITE_API_URL || `\${import.meta.env.VITE_API_URL}`}${product.image || ""}`
    pattern4 = re.compile(r'`\$\{import\.meta\.env\.VITE_API_URL\s*\|\|\s*`\\\$\{import\.meta\.env\.VITE_API_URL\}`\s*\}(\$\{.*?\}|\/.*?)`')
    
    count = 0
    for root, _, files in os.walk(frontend_src):
        for f in files:
            if f.endswith(('.js', '.jsx', '.ts', '.tsx')):
                filepath = os.path.join(root, f)
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                original = content
                content = pattern1.sub('"', content)
                content = pattern2.sub('`/', content)
                content = pattern3.sub('"', content)
                content = pattern4.sub(r'`\1`', content)
                
                if original != content:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(content)
                    print(f"Updated {filepath}")
                    count += 1
    print(f"Total updated files: {count}")

if __name__ == "__main__":
    rewrite_files()
