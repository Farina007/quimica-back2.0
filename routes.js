
import express from 'express'
import sql from './database.js'
import jwt from 'jsonwebtoken'
import { expressjwt } from "express-jwt"



const router = express.Router()

router.get('/', async (req, res)=>{
    try{
        const data = await sql`select * from usuario`;
        return res.status(200).json(data)
    }
    catch{
        return res.status(404).json(`error`)
    }
})

router.post('/login', async (req, res)=>{
    try {
        const { email, senha } = req.body;
        if(email != null && email != "" && senha != null && senha != "")
        {
            const data = await sql`select id, nome from Usuario where email = ${email} and senha = ${senha}`;
            if(data.length == 0)
            {   
                return res.status(204).json('usuario ou senha incorreta')
            }
            const token = jwt.sign({ email: email }, 'keys_hub', { algorithm: 'HS256' });
            return res.status(200).json({msg:token})
        }
            return res.status(400).json("bad request");

    } 
    catch (error){
        console.log(error)
        return res.status(500).json('Error on server!')
    }
})

router.post("/teste/new", expressjwt({ secret: 'keys_hub', algorithms: ["HS256"]}),async (req, res) => {
    console.log(req.auth)
    if (!req.auth.email) return res.status(401).json('Não autorizado');
        //res.status(200).json('autorizado!');
    try {
        const {nome} = req.body;
        await sql`insert into teste(nome) values(${nome})`
        return res.status(200).json('ok')
    } 
    catch (error) {
        return res.status(500).json('error in insert new teste')
    }
})

router.put('/teste/:id', expressjwt({ secret: 'keys_hub', algorithms: ["HS256"]}) , async (req, res) =>{
    console.log(req.auth)
    if (!req.auth.email) return res.status(401).json('Não autorizado');
        res.status(200).json('autorizado!');
    try {
        const { nome } = req.body;
        const { id } = req.params; 
        await sql`update questao set  = ${nome} where id = ${id}`
        return res.status(200).json('ok')
    } catch (error) {
        return res.status(500).json('error in update teste')
    }
})

router.delete('/teste/:id', expressjwt({ secret: 'keys_hub', algorithms: ["HS256"]}), async (req, res) =>{
    console.log(req.auth)
    if (!req.auth.email) return res.status(401).json('Não autorizado');
        res.status(200).json('autorizado!');
    try {
        const { id } = req.params;
        await sql`update turmas set _status = 0 where id = ${id}`
        return res.status(200).json('ok')
    } catch (error) {
        return res.status(500).json('error to delete teste')
    }
})

router.get('/teste', expressjwt({ secret: 'keys_hub', algorithms: ["HS256"]}), async (req, res)=>{
    console.log(req.auth)
    if (!req.auth.email) return res.status(401).json('Não autorizado');
        //res.status(200).json('autorizado!');
    try{
        const teste = await sql`select q.id, q.enunciado, q.imagem, q.alternativa_a, q.alternativa_b, q.alternativa_c, alternativa_d, 
alternativa_e, correta, nivel_questao from materia as m inner join questao_materia as qm on qm.id_materia = m.id inner join questao as q 
on q.id = qm.id_questao where m.id = 1`
return res.status(200).json(teste)
    } 
    catch(error){
        console.log(error)
        return res.status(500).json('error ao encontrar')
    }
})

router.get("/testzin", async (req, res) => {
    try {
        const select = await sql`select * from teste`
        return res.status(200).json(select)
    } 
    catch (error) {
        return res.status(500).json('error ao encontrar')
    }
})  


export default router
