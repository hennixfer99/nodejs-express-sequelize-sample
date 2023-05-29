
class HelloWorld {

    helloWorld(req, res) {
        let name = req.query.name;
        if (name) {
            return res.send(`Hello ${name}!`);
        }
        return res.send(`Hello world!`);
    };

    helloWorldParams(req, res){
        let name = req.params.name;
        return res.send(`Hello ${name}!`);
    };
}

const helloWorldController = new HelloWorld();

module.exports = helloWorldController;
