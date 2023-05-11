const express = require('express');
const router = express.Router();
const Appuntamento = require('./models/appuntamento');

//mongoose.model('Appointment', appointmentSchema);



router.get('', (req, res) => {
    Appuntamento.find({}).then(appuntamenti => {
      res.send(appuntamenti);
    });
});

// get by userid
router.get('/:id', async (req, res) => {
    let appuntamenti = await Appuntamento.find().where(req.params.usrid).in(involves).exec();



    res.status(200).json({
        self: 'api/v1/appuntamneti/' + calendario.idCalendario,
        nome: calendario.nome,
        appuntamenti: calendario.appuntamenti
    })

})



router.post('', async (req, res)=>{
    const myAppointment = new Appointment({
        title: 'Meeting with Client',
        date: new Date(),
        sharedWith: ['John', 'Jane']
       });
       myAppointment.save();
})



