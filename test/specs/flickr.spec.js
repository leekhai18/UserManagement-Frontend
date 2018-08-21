define(['app/viewmodels/flickr'], function (flickr) {
    describe('viewmodels/flickr', function(){
        it('returns true', function () {
            expect(flickr.displayName).toBe("Flickr");
        });
    });
});