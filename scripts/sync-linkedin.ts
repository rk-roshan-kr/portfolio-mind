import fs from 'fs';
import path from 'path';

/**
 * Neural Audit: Automated LinkedIn Ingestion Trigger
 * This script manages the synchronization between external LinkedIn activity and the internal log system.
 */

const LOGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'logs.ts');

interface RawLinkedInPost {
  urn: string;
  text: string;
  timestamp: string;
  reactions?: number;
  comments?: number;
}

// Configuration
const PROFILE_ID = 'roshankumargupta-0xc0de';
const API_KEY = process.env.LINKEDIN_SCRAPER_KEY || 'ff3103c220msh538d7a70de67a27p1abc50jsn295c70d5a6db'; 
const API_HOST = 'linkedin-data-scraper1.p.rapidapi.com';

async function fetchLatestPosts(): Promise<RawLinkedInPost[]> {
  console.log(`📡 Connecting to Signal Source: ${API_HOST}...`);
  
  try {
    // Note: Standard RapidAPI post endpoint for this scraper host
    const response = await fetch(`https://${API_HOST}/get_profile_posts.php?username=${PROFILE_ID}`, {
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Transmission Fault: ${response.statusText}`);

    const data = await response.json();
    
    // Safety check for empty or invalid data
    if (!data || !data.posts) {
      console.warn('No active signals detected in the carrier wave.');
      return [];
    }

    return data.posts.map((p: any) => ({
      urn: p.urn || p.id,
      text: p.text || p.description || '',
      timestamp: p.createdAt || p.postedAt || new Date().toISOString(),
      reactions: p.totalReactions || p.reactionsCount || 0,
      comments: p.totalComments || p.commentsCount || 0
    }));
  } catch (error) {
    console.error('CRITICAL: Carrier Signal Lost:', error);
    return [];
  }
}

function updateLogFile(newPosts: RawLinkedInPost[]) {
  const fileContent = fs.readFileSync(LOGS_FILE_PATH, 'utf-8');
  
  // Extract existing logs array content
  const logsRegex = /export const logs: LogEntry\[] = (\[[\s\S]*?]);/;
  const match = fileContent.match(logsRegex);
  
  if (!match) {
    console.error('Could not find logs array in src/data/logs.ts');
    return;
  }

  let existingLogs = eval(match[1].replace(/export interface[\s\S]*?}/, '')); // Simplified extraction
  // Note: Eval is used here for script simplicity; in a real env, parsing the TS as JSON or using a TS parser is safer.
  
  // For this automation, we will use a more robust string replacement approach.
  const existingContent = match[1];
  let updatedContent = existingContent;

  newPosts.forEach(post => {
    const permalink = `https://www.linkedin.com/feed/update/${post.urn}/`;
    
    // Check if URN already exists
    if (existingContent.includes(post.urn)) {
      console.log(`Log already exists for URN: ${post.urn}`);
      return;
    }

    const newId = `LOG_AUTO_${Date.now().toString().slice(-6)}`;
    const newEntry = `  {
    id: '${newId}',
    timestamp: '${post.timestamp}',
    sector: 'SYSTEMS',
    title: 'Automated Sync: ${post.text.slice(0, 30)}...',
    content: '${post.text.replace(/'/g, "\\'").replace(/\n/g, ' ')}',
    metadata: {
      status: 'STABLE',
      reactions: '${post.reactions}+'
    },
    externalLink: '${permalink}'
  },`;

    // Insert at the beginning of the array after the opening bracket
    updatedContent = updatedContent.replace('[', '[\n' + newEntry);
    console.log(`Injected new log: ${newId}`);
  });

  const finalFileContent = fileContent.replace(existingContent, updatedContent);
  fs.writeFileSync(LOGS_FILE_PATH, finalFileContent);
  console.log('src/data/logs.ts updated successfully.');
}

async function main() {
  console.log('Initiating career signal synchronization...');
  const posts = await fetchLatestPosts();
  if (posts.length > 0) {
    updateLogFile(posts);
  } else {
    console.log('No new updates detected.');
  }
}

main().catch(console.error);
