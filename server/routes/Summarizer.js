import express from 'express'
import { summarizeVideo } from '../controller/summaryController.js'
import { answerQuery } from '../controller/questionController.js'

const router = express.Router()

router.post('/summary', async (req, res) => {
    try {
        const url = req.body//"https://www.youtube.com/watch?v=BZP1rYjoBgI"
        const videoUrl = url.videoUrl
        const summaryResponse = await summarizeVideo(videoUrl);
        const summary = summaryResponse.summary;
        if(summary) {
            res.status(200).send({
                success: true,
                message: 'Summary generated successfully',
                summary: summary,
                videoUrl: videoUrl
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ 
            success: false,
            message: 'Internal server error',
    });
    }
});
 
router.get('/query', async (req, res) => {
    try {
        const url = req.body//"https://www.youtube.com/watch?v=mDAoLO4G4CQ"
        const videoUrl = url.videoUrl;
        const query = req.body//"Did The Cubs win the world series?"
        const userQuery = query.userQuery;
        console.log( userQuery);
        const answer = await answerQuery(videoUrl, userQuery);
        if(answer) {
            res.status(200).send({
                success: true,
                message: 'Answer generated successfully',
                answer: answer
            })
        } else {
            res.status(200).send({
                success: false,
                message: 'Answer could not be generated',
            })
        }
    } catch (error) {      
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router;
