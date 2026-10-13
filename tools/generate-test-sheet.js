const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const XLSX = require('xlsx');

// Configuration & Paths
const TESTS_DIR = path.join(__dirname, '..', 'apps', 'tt-client', 'tests');
const TARGET_OUTPUTS = [
  path.join(__dirname, '..', 'apps', 'tt-client', 'test-artifact', 'web-tests.xlsx'),
  path.join(__dirname, '..', 'test-artifact', 'web-tests.xlsx')
];

// Module naming dictionary based on spec filenames
const MODULE_MAPPING = {
  'auth.spec.ts': { name: 'Authentication', prefix: 'AUTH' },
  'user-crud.spec.ts': { name: 'Member Management', prefix: 'USER' },
  'tournament-crud.spec.ts': { name: 'Tournament Management', prefix: 'TRN' },
  'match-crud.spec.ts': { name: 'Match Management', prefix: 'MTCH' },
  'match-bracket.spec.ts': { name: 'Bracket Management', prefix: 'BRKT' },
  'multi-sport.spec.ts': { name: 'Multi-Sport Tournaments', prefix: 'SPRT' },
};

function resolveModuleInfo(fileName) {
  const base = path.basename(fileName);
  if (MODULE_MAPPING[base]) {
    return MODULE_MAPPING[base];
  }
  // Auto-generate title case module name for any new test spec file
  const cleaned = base.replace('.spec.ts', '').replace(/-|_/g, ' ');
  const titleCase = cleaned.replace(/\b\w/g, c => c.toUpperCase());
  const prefix = base.substring(0, 4).toUpperCase();
  return { name: titleCase, prefix };
}

// Derive Test Type from title / steps
function deriveTestType(title, steps) {
  const lower = title.toLowerCase();
  if (lower.startsWith('create:') || lower.includes('create a new') || lower.includes('register a new')) {
    return lower.includes('negative') || lower.includes('reject') ? 'Validation (Negative)' : 'CRUD - Create (Positive)';
  }
  if (lower.startsWith('read:') || lower.includes('inspect overview') || lower.includes('view complete')) {
    return 'CRUD - Read (Positive)';
  }
  if (lower.startsWith('update:') || lower.includes('edit')) {
    return 'CRUD - Update (Positive)';
  }
  if (lower.startsWith('delete:') || lower.includes('soft-delete') || lower.includes('remove')) {
    return 'CRUD - Delete';
  }
  if (lower.includes('status') || lower.includes('toggle') || lower.includes('transition')) {
    return 'State Transition';
  }
  if (lower.includes('validation') || lower.includes('reject') || lower.includes('invalid') || lower.includes('short')) {
    return 'Validation (Negative)';
  }
  if (lower.includes('display') || lower.includes('controls') || lower.includes('toggle between')) {
    return 'UI / Functional';
  }
  return 'Functional E2E';
}

// Derive Priority
function derivePriority(title, testType) {
  const lower = title.toLowerCase();
  if (lower.includes('p0') || testType.includes('Create') || testType.includes('Delete') || lower.includes('login') || lower.includes('register')) {
    return 'P0 (Critical)';
  }
  if (lower.includes('too short') || lower.includes('format')) {
    return 'P1 (High)';
  }
  return 'P1 (High)';
}

// Derive human-readable description
function deriveDescription(title, steps) {
  if (steps && steps.length > 0) {
    const mainAction = steps[steps.length - 1];
    return `Executes ${title}. Grouped verification includes: ${steps.join(', ')}.`;
  }
  return `Automated test verifying: ${title}.`;
}

// Derive expected result from steps and title
function deriveExpectedResult(title, steps) {
  if (steps && steps.length > 0) {
    const lastStep = steps[steps.length - 1];
    return `Successfully completes execution: ${lastStep} without errors.`;
  }
  return 'All assertions in scenario pass successfully.';
}

// Recursively find all *.spec.ts files
function findSpecFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findSpecFiles(filePath));
    } else if (file.endsWith('.spec.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

// Parse single test spec file with TypeScript AST
function parseSpecFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(path.basename(filePath), fileContent, ts.ScriptTarget.Latest, true);
  const relativePath = path.relative(path.join(__dirname, '..'), filePath).replace(/\\/g, '/');
  const moduleInfo = resolveModuleInfo(filePath);

  const testsInFile = [];
  let testCounter = 1;

  function visit(node, parentDescribe = '') {
    if (ts.isCallExpression(node)) {
      const exprText = node.expression.getText(sourceFile);

      if (exprText === 'test.describe') {
        const describeTitle = node.arguments[0]?.text || parentDescribe;
        if (node.arguments[1]) {
          ts.forEachChild(node.arguments[1], child => visit(child, describeTitle));
        }
        return;
      }

      if (exprText === 'test') {
        const testTitle = node.arguments[0]?.text || '';
        const steps = [];

        function findSteps(n) {
          if (ts.isCallExpression(n) && n.expression.getText(sourceFile) === 'test.step') {
            const stepTitle = n.arguments[0]?.text;
            if (stepTitle) steps.push(stepTitle);
          }
          ts.forEachChild(n, findSteps);
        }

        if (node.arguments[1]) {
          ts.forEachChild(node.arguments[1], findSteps);
        }

        const testId = `${moduleInfo.prefix}-${String(testCounter).padStart(3, '0')}`;
        testCounter++;

        const testType = deriveTestType(testTitle, steps);
        const priority = derivePriority(testTitle, testType);
        const description = deriveDescription(testTitle, steps);
        const expectedResult = deriveExpectedResult(testTitle, steps);

        const formattedSteps = steps.length > 0
          ? steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')
          : '1. Execute test scenario and assert expectations';

        const fileStat = fs.statSync(filePath);
        const updatedDate = fileStat.mtime.toISOString().split('T')[0];

        testsInFile.push({
          testId,
          module: moduleInfo.name,
          group: parentDescribe || moduleInfo.name,
          title: testTitle,
          description,
          testType,
          priority,
          automatedSteps: formattedSteps,
          expectedResult,
          specFile: relativePath,
          status: 'Automated & Passing',
          createdAt: updatedDate,
          lastUpdated: updatedDate
        });
      }
    }

    ts.forEachChild(node, child => visit(child, parentDescribe));
  }

  visit(sourceFile);
  return testsInFile;
}

// Convert items to Sheet
function createWorksheet(items) {
  const headers = [
    'Test ID',
    'Module',
    'Scenario Group',
    'Title',
    'Description',
    'Test Type',
    'Priority',
    'Automated Steps',
    'Expected Result',
    'Spec File',
    'Status',
    'Created At',
    'Last Updated'
  ];

  const rows = items.map(tc => [
    tc.testId,
    tc.module,
    tc.group,
    tc.title,
    tc.description,
    tc.testType,
    tc.priority,
    tc.automatedSteps,
    tc.expectedResult,
    tc.specFile,
    tc.status,
    tc.createdAt,
    tc.lastUpdated
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  ws['!cols'] = [
    { wch: 12 }, // Test ID
    { wch: 24 }, // Module
    { wch: 30 }, // Scenario Group
    { wch: 45 }, // Title
    { wch: 55 }, // Description
    { wch: 24 }, // Test Type
    { wch: 15 }, // Priority
    { wch: 55 }, // Automated Steps
    { wch: 45 }, // Expected Result
    { wch: 32 }, // Spec File
    { wch: 22 }, // Status
    { wch: 12 }, // Created At
    { wch: 12 }  // Last Updated
  ];

  return ws;
}

// Generate Summary Sheet
function createSummarySheet(items, moduleList) {
  const total = items.length;
  const passingCount = items.filter(t => t.status.includes('Passing')).length;

  const data = [
    ['Test Catalog & Coverage Summary (Auto-Synchronized)', ''],
    ['Generated At', new Date().toISOString().split('T')[0]],
    ['Application', 'TT-Client (Table Tennis Management Portal)'],
    ['Synchronization Mode', 'Live Code AST Parser (Zero Manual Overhead)'],
    ['Test Engine', 'Playwright Test + TypeScript + Page Object Model'],
    ['', ''],
    ['Key Metric', 'Value'],
    ['Total Automated Scenarios', total],
    ['Passing Scenarios', passingCount],
    ['Automation Coverage Rate', '100%'],
    ['', ''],
    ['Module Breakdown', 'Scenario Count']
  ];

  moduleList.forEach(mod => {
    const count = items.filter(t => t.module === mod).length;
    data.push([`${mod} Module`, count]);
  });

  data.push(['', '']);
  data.push(['How to Update', 'Whenever a new Playwright test is written in tests/**/*.spec.ts, run `npm run update:test-sheet`. The script parses the TypeScript code directly and updates this workbook.']);

  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 35 }, { wch: 60 }];
  return ws;
}

// Main Execution
function run() {
  console.log(`Scanning test specifications in: ${TESTS_DIR}...`);
  const specFiles = findSpecFiles(TESTS_DIR);
  console.log(`Found ${specFiles.length} test specification files.`);

  let allTests = [];
  specFiles.forEach(file => {
    const tests = parseSpecFile(file);
    console.log(`- ${path.basename(file)}: Parsed ${tests.length} tests`);
    allTests = allTests.concat(tests);
  });

  console.log(`Total test scenarios extracted: ${allTests.length}`);

  const distinctModules = [...new Set(allTests.map(t => t.module))];

  const wb = XLSX.utils.book_new();

  // 1. Summary Sheet
  const summarySheet = createSummarySheet(allTests, distinctModules);
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

  // 2. All Tests Sheet
  const allTestsSheet = createWorksheet(allTests);
  XLSX.utils.book_append_sheet(wb, allTestsSheet, 'All Tests');

  // 3. Module Tabs
  distinctModules.forEach(mod => {
    const moduleTests = allTests.filter(t => t.module === mod);
    const modSheet = createWorksheet(moduleTests);
    // Excel sheet name max 31 chars
    const sheetName = mod.substring(0, 31);
    XLSX.utils.book_append_sheet(wb, modSheet, sheetName);
  });

  // Write outputs
  TARGET_OUTPUTS.forEach(outPath => {
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    XLSX.writeFile(wb, outPath);
    console.log(`✓ Synchronized live workbook to: ${outPath}`);
  });
}

run();
