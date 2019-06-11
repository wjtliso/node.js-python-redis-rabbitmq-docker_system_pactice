const supertest = require("supertest");
const should = require("should");
const server = supertest.agent("http://localhost:3000");

describe("Post image test",function(){
    it("post jpg and should return image id", function(done){
        server
        .post("/image")
        .attach('image', './test.jpg')
        .expect(200)
        .end(function(err, res) {
            res.body.id.should.not.equal("");
            res.body.error.should.equal("");
            done();
        });
    });

    it("post png and should return image id", function(done){
        server
        .post("/image")
        .attach('image', './test.png')
        .expect(200)
        .end(function(err, res) {
            res.body.id.should.not.equal("");
            res.body.error.should.equal("");
            done();
        });
    });

    it("post gif and should return image id", function(done){
        server
        .post("/image")
        .attach('image', './test.gif')
        .expect(200)
        .end(function(err, res) {
            res.body.id.should.not.equal("");
            res.body.error.should.equal("");
            done();
        });
    });

    it("post empty file type and should return error", function(done){
        server
        .post("/image")
        .attach('image', './test_empty.txt')
        .expect(200)
        .end(function(err, res) {
            res.body.id.should.equal("");
            res.body.error.should.equal("The server can not process the null file, please send a file again!");
            done();
        });
    });

    it("post other type file type and should return error", function(done){
      server
      .post("/image")
      .attach('image', './test.txt')
      .expect(200)
      .end(function(err, res) {
          res.body.id.should.equal("");
          res.body.error.should.equal("The server could only process the image file (like .jpg, .png, .gif), please try again!");
          done();
      });
  });
});