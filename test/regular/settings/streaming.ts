import { focusChild, focusMain, test, useSpectron } from '../../helpers/spectron';
import { logIn } from '../../helpers/spectron/user';
import { getFormInput } from '../../helpers/spectron/forms';
import { goLive, stopStream } from '../../helpers/spectron/streaming';
import { showSettings } from '../../helpers/spectron/settings';
import { FormMonkey } from '../../helpers/form-monkey';

useSpectron();

test('Populates stream settings after go live', async t => {
  const { app } = t.context;

  await logIn(t);
  await goLive(t);
  await stopStream(t);
  await showSettings(t, 'Stream');
  await app.client.click('a=Stream to custom ingest');
  const form = new FormMonkey(t);
  t.true(
    await form.includesByTitles({
      'Stream Type': 'Streaming Services',
      Service: 'Twitch',
      Server: 'Auto (Recommended)',
    }),
  );
});

test('Populates stream key after go live', async t => {
  const { app } = t.context;

  await logIn(t);
  await goLive(t);
  await stopStream(t);
  await showSettings(t, 'Stream');
  await app.client.click('a=Stream to custom ingest');

  // Test that we can toggle show stream key, also helps us fetch the value
  await app.client.click('button=Show');
  t.false(await app.client.isExisting('input[type=password]'));

  // Check that is a somewhat valid Twitch stream key
  const streamKey = await getFormInput(t, 'Stream key');
  t.true(streamKey.startsWith('live_'));
  t.true(streamKey.length > 40);

  // Test that we can hide back the stream key
  await app.client.click('button=Hide');
  t.true(await app.client.isExisting('input[type=password]'));
});
