const fs = require('fs');

const data = JSON.parse(fs.readFileSync('rag/vector-store.json', 'utf-8'));
const fefChunks = data.chunks.filter(c => c.metadata.source.includes('FEF.md'));

console.log('Total FEF.md chunks:', fefChunks.length);
console.log('Chunks WITH embeddings:', fefChunks.filter(c => c.embedding && c.embedding.length > 0).length);
console.log('Chunks WITHOUT embeddings:', fefChunks.filter(c => !c.embedding || c.embedding.length === 0).length);

if (fefChunks[0]) {
  console.log('\nFirst chunk embedding length:', fefChunks[0].embedding?.length || 0);
  console.log('First chunk content preview:', fefChunks[0].content.substring(0, 150));
}

console.log('\n=== All FEF chunk titles ===');
fefChunks.slice(0, 5).forEach((c, i) => {
  console.log(`${i + 1}. Has embedding: ${c.embedding ? 'YES' : 'NO'}, Length: ${c.embedding?.length || 0}`);
  console.log(`   Content: ${c.content.substring(0, 100)}...`);
});
