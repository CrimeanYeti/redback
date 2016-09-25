var redback = require('./common').createClient(),
    client2 = require('./common').createClient(),
    assert = require('assert');

//Close the Redis connection after 500ms
setTimeout(function () {
    redback.client.quit();
    client2.client.quit();
}, 500);

module.exports = {

    'test channels': function () {
        var channel = redback.createChannel('test_channel'), received = false;

        channel.on('message', function (msg) {
            assert.equal('foo', msg);
            if (msg != 'foo') {
                assert.ok(false);
            }
            received = true;
        });

        channel.subscribe(function () {
            //Bind another client so it doesn't affect the other tests
            channel.setClient(client2.client);
            channel.publish('foo', function (err) {
                assert.ok(true);
            });
        });

        setTimeout(function () {
            channel.unsubscribe(function(){
                assert.ok(true);
            });
            assert.ok(received);
        }, 200);
    }

}
