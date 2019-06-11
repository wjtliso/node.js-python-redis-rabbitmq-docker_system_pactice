const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:3000");

describe("Get image test",function(){
    let imageId = "";
    it("post jpg and should return image id", function(done){
        server
        .post("/image")
        .attach('image', './test.jpg')
        .expect(200)
        .end(function(err, res) {
            imageId = res.body.id;
            done();
        });
    });

    it("get existence image and should return image", function(){
        const path = "/image/" + imageId + "/thumbnail"
        return setTimeout(() => {
            server
            .get(path)
            .expect(200)
            .end(function(err, res) {
                res.header['content-type'].should.equal("image/png");
            })
        }, 1000);
    });

    it("get not existence image and should return error", function(){
        const path = "/image/aaaaaa/thumbnail"
        server
        .get(path)
        .expect(200)
        .end(function(err, res) {
            res.body.error.should.equal("There is no such image or the image is still processing, please try again!");
        });
    });

});