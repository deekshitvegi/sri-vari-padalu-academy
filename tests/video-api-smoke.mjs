// Run against local development only: node tests/video-api-smoke.mjs
import assert from 'node:assert/strict';
const base = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
const target = new URL(base);
if (target.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(target.hostname)) {
  throw new Error('Run this persistence smoke check against a local development server only.');
}
const original = (await (await fetch(base + '/api/content')).json()).content;
const content = structuredClone(original);
const channel = 'UCabcdefghijklmnopqrstuv';
const video = { id: 'video-smoke-test', title: 'Published performance fixture', url: 'https://youtu.be/aB_cD-eF012', description: '', kind: 'performance', published: true };
content.videos = [video, { ...video, id: 'live-smoke-test', title: 'Published livestream fixture', kind: 'livestream', url: 'https://youtube.com/live/ZyXwVuT9876' }, { ...video, id: 'draft-smoke-test', title: 'Private video draft fixture', published: false }];
content.youtubeChannelId = `https://www.youtube.com/channel/${channel}`;
const put = (value, route = '/api/content') => fetch(base + route, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: value }) });
try {
  assert.equal((await put(content)).status, 200);
  const saved = (await (await fetch(base + '/api/content')).json()).content;
  assert.deepEqual(saved.videos, content.videos);
  assert.equal(saved.youtubeChannelId, channel);
  const html = await (await fetch(base + '/gallery')).text();
  assert.ok(html.includes(video.title), 'published performance renders');
  assert.ok(html.includes('Published livestream fixture'), 'published livestream renders');
  assert.ok(!html.includes('Private video draft fixture'), 'draft excluded from public HTML and RSC payload');
  assert.ok(html.includes('Latest from the academy'), 'automatic uploads section renders');
  assert.ok(html.includes(`UU${channel.slice(2)}`), 'uploads playlist derived from channel ID');
  for (const route of ['/api/content', '/api/full-content']) {
    const bad = structuredClone(content); bad.videos[0].url = 'https://evil.example/embed/aB_cD-eF012';
    assert.equal((await put(bad, route)).status, 400);
    bad.videos = []; bad.youtubeChannelId = 'invalid-channel';
    assert.equal((await put(bad, route)).status, 400);
    const legacy = structuredClone(content); delete legacy.videos; delete legacy.youtubeChannelId;
    assert.equal((await put(legacy, route)).status, 200);
    const persisted = (await (await fetch(base + '/api/content')).json()).content;
    assert.deepEqual(persisted.videos, content.videos);
    assert.equal(persisted.youtubeChannelId, channel);
  }
  const result = await (await fetch(`${base}/api/youtube-channel?url=${channel}`)).json();
  assert.equal(result.channelId, channel);
  assert.equal((await fetch(`${base}/api/youtube-channel?url=https://evil.example`)).status, 400);
  assert.equal((await fetch(base + '/api/content', { headers: { 'x-forwarded-host': 'academy.example' } })).status, 401);
  const deleted = structuredClone(content); deleted.videos = [];
  assert.equal((await put(deleted)).status, 200);
  assert.ok(!(await (await fetch(base + '/gallery')).text()).includes(video.title));
  console.log('PASS: video CRUD, live entries, draft privacy, automatic playlist, URL validation, legacy saves, lookup validation and authentication');
} finally {
  assert.equal((await put(original)).status, 200, 'restore original content');
  console.log('Original local content restored.');
}
