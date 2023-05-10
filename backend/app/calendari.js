const express = require('express');
const router = express.Router();
const calendario = require('./models/calendario');


router.get('', async (req, res) => {
    
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let calendari = await calendario.find({});

    calendari = calendari.map( (calendario) => {
        return {
            self: '/api/v1/calendari/' + calendario.idCalendario,
            nome: calendario.nome
        };
    });

    res.status(200).json(calendari);
});

router.get('/:id',)




module.exports = router;