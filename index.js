const app = require('./src/routes/routes');
const {sequelize} = require('./src/database/api')
const port = 3000;

async function init() {
    try{
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(port, async () => {
            try{
                console.log(`app running at port ${port}`);
            }catch (error){
                console.log(`estamos com erro no servidor:`,error);
            }
        });
    }catch(error){
        console.log(`agora o erro é no sequelize`,error)
    }
}

init()


