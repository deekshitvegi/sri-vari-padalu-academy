import assert from 'node:assert/strict';
import test from 'node:test';
import { youtubeVideoId, videoValidationError } from '../app/youtube.ts';
const id = 'aB_cD-eF012';

test('accepts individual video, mobile, share, Shorts and livestream URLs', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${id}&t=30`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=share`,
    `https://youtube.com/live/${id}?feature=share`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube-nocookie.com/embed/${id}`,
  ]) assert.equal(youtubeVideoId(url), id, url);
});

test('rejects unrelated hosts, credentials, unsafe protocols and malformed IDs', () => {
  for (const url of [
    `https://youtube.com.evil.example/watch?v=${id}`,
    `https://evil.example/?v=${id}`,
    `https://user@youtube.com/watch?v=${id}`,
    `http://youtube.com/watch?v=${id}`,
    `javascript:alert(1)`, `https://youtube.com:8080/watch?v=${id}`,
    'https://youtube.com/@academy/live', 'https://youtube.com/playlist?list=abc',
    'https://youtu.be/too-short', `https://youtu.be/${id}/extra`,
    '<iframe src="https://youtube.com/embed/test"></iframe>',
  ]) assert.equal(youtubeVideoId(url), null, url);
});

test('validates drafts as well as published records and rejects duplicate keys', () => {
  const video = { id: 'v1', title: 'Performance', description: '', url: `https://youtu.be/${id}`, kind: 'performance', published: false };
  assert.equal(videoValidationError([]), null);
  assert.equal(videoValidationError([video]), null);
  assert.equal(videoValidationError([{ ...video, kind: 'livestream', published: true }]), null);
  assert.match(videoValidationError([{ ...video, url: '' }]), /valid HTTPS YouTube/);
  assert.match(videoValidationError([{ ...video, title: ' ' }]), /title/);
  assert.match(videoValidationError([video, video]), /duplicate/);
  assert.match(videoValidationError([{ ...video, published: 'yes' }]), /invalid video details/);
});

test('accepts channel IDs and channel URLs for automatic uploads, rejects handles and impostors', async () => {
  const { youtubeChannelId, channelValidationError } = await import('../app/youtube.ts');
  const channel = 'UCabcdefghijklmnopqrstuv';
  assert.equal(youtubeChannelId(channel), channel);
  assert.equal(youtubeChannelId(`https://www.youtube.com/channel/${channel}`), channel);
  assert.equal(youtubeChannelId('https://youtube.com/@academy'), null);
  assert.equal(youtubeChannelId(`https://youtube.com.evil.test/channel/${channel}`), null);
  assert.equal(channelValidationError(''), null);
  assert.equal(channelValidationError(channel), null);
  assert.ok(channelValidationError('not-a-channel'));
});
