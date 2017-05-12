import test from 'ava'
import assert from 'assert'
import fetchVCR from '..'

test.before(t => {
  fetchVCR.configure({
    mode: 'playback',
    fixturePath: __dirname + '/_fixtures'
  })
})

test('fetches from the fixture', t => {
  // fetchVCR.configure({mode: 'record'})
  return fetchVCR('https://cnx.org')
  .then(response => {
    return response.text()
    .then(text => t.pass())
  })
})

test('caches the fixture', async t => {
  const TEST_URL = 'https://openstax.org'
  // Verify that the fixture does not yet exist
  fetchVCR.configure({mode: 'playback'})
  try {
    await fetchVCR(TEST_URL)
    t.fail('This URL Should not initially be in the fixtures directory')
  } catch (e) {
    assert(e)
  }
  // Save the response into the fixtures directory
  fetchVCR.configure({mode: 'cache'})
  const origResp = await fetchVCR(TEST_URL)
  const originalText = await origResp.text()

  // Verify that it was saved into the fixtures directory
  fetchVCR.configure({mode: 'playback'})
  const newResp = await fetchVCR(TEST_URL)
  const newText = await newResp.text()

  assert.equal(originalText, newText)
  t.pass()
})
