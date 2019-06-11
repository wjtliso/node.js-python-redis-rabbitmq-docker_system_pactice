let postImage = function(uploadFile, uuid, rabbitmqChannel, queueName) {
    let result = {
        serverError: "",
        fileError: ""
    };
    
    if (uploadFile === null) {
        console.log(" [ ] Error! Empty file!");
        result.fileError = "The server can not process the null file, please send a file again!"
        return result;
    }

    const image = uploadFile.image;
    if (!isImage(image.mimetype)) {
        console.log(" [ ] Error! Not an image file!");
        result.fileError = "The server could only process the image file (like .jpg, .png, .gif), please try again!";
        return result;
    }

    if (rabbitmqChannel === null) {
        console.log(" [ ] Error! Rabbitmq Channel not establish!")
        result.serverError = "Something wrong with the server, please try again!";
        return result;
    }

    const msg = {
        image_name: image.name,
        image_id: uuid,
        image_content: image.data
    };
    try {
        rabbitmqChannel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)), {
            persistent: true
        });
        console.log(" [x] Sent image '%s'", msg.image_id);
    }
    catch(e) {
        console.log(e);
        result.serverError = "Something wrong with the server, please try again!";
    }
    return result;
}

function isImage(mimeType) {
    const imageType = ["image/jpeg", "image/png", "image/gif"];
    if (imageType.includes(mimeType)) {
        return true
    }
    return false
}

exports.postImage = postImage
