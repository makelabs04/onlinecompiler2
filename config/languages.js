// backend/config/languages.js

const LANGUAGES = {
  java: {
    id: 'java',
    name: 'Java',
    pistonRuntime: 'java',
    pistonVersion: '15.0.2',
    judge0Id: 62,
    extension: '.java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    icon: '☕',
    color: '#f89820',
  },
  python: {
    id: 'python',
    name: 'Python',
    pistonRuntime: 'python',
    pistonVersion: '3.10.0',
    judge0Id: 71,
    extension: '.py',
    defaultCode: `# Python Hello World
print("Hello, World!")

# Try some Python features
name = "CodeCraft"
for i in range(5):
    print(f"Welcome to {name}! Iteration {i+1}")`,
    icon: '🐍',
    color: '#3572A5',
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    pistonRuntime: 'c++',
    pistonVersion: '10.2.0',
    judge0Id: 54,
    extension: '.cpp',
    defaultCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string language = "C++";
    cout << "Welcome to " << language << " on CodeCraft!" << endl;
    
    return 0;
}`,
    icon: '⚡',
    color: '#00599C',
  },
  c: {
    id: 'c',
    name: 'C',
    pistonRuntime: 'c',
    pistonVersion: '10.2.0',
    judge0Id: 50,
    extension: '.c',
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to C on CodeCraft!\\n");
    
    int sum = 0;
    for(int i = 1; i <= 10; i++) {
        sum += i;
    }
    printf("Sum of 1-10: %d\\n", sum);
    
    return 0;
}`,
    icon: '🔧',
    color: '#A8B9CC',
  },
  csharp: {
    id: 'csharp',
    name: 'C#',
    pistonRuntime: 'csharp',
    pistonVersion: '6.12.0',
    judge0Id: 51,
    extension: '.cs',
    defaultCode: `using System;
using System.Collections.Generic;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, World!");
        Console.WriteLine("Welcome to C# on CodeCraft!");
        
        var languages = new List<string> { "C#", "Java", "Python" };
        foreach (var lang in languages) {
            Console.WriteLine($"Language: {lang}");
        }
    }
}`,
    icon: '💜',
    color: '#68217A',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    pistonRuntime: 'javascript',
    pistonVersion: '18.15.0',
    judge0Id: 63,
    extension: '.js',
    defaultCode: `// JavaScript Hello World
console.log("Hello, World!");

// Modern JavaScript features
const greet = (name) => \`Welcome to CodeCraft, \${name}!\`;
console.log(greet("Developer"));

// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`,
    icon: '🌐',
    color: '#F7DF1E',
  },
  php: {
    id: 'php',
    name: 'PHP',
    pistonRuntime: 'php',
    pistonVersion: '8.2.3',
    judge0Id: 68,
    extension: '.php',
    defaultCode: `<?php
echo "Hello, World!\\n";
echo "Welcome to PHP on CodeCraft!\\n";

// PHP features
$languages = ["PHP", "Java", "Python", "C++"];
foreach ($languages as $lang) {
    echo "Language: " . $lang . "\\n";
}

$sum = array_sum(range(1, 10));
echo "Sum of 1-10: " . $sum . "\\n";
?>`,
    icon: '🐘',
    color: '#777BB4',
  },
};

module.exports = LANGUAGES;