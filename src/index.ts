import express from 'express'
import cors from 'cors'
import gameRoute from './routes/gameRoute'
import userRoute from './routes/userRoute'
import transaksi from './routes/transaksiRouete'
import path from 'path'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const PORT: number = 8000
const app = express()
app.use(cors())
app.use(express.json())

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Zenith',
            version: '1.0.0',
            description: 'API documentation for Zenith',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: { // Nama skema keamanan
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // Format token
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routers/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/game', gameRoute)
app.use('/user', userRoute)
app.use('/transaksi', transaksi)

app.use(express.static(path.join(__dirname, '..', 'public')))

app.listen(PORT, () => {~
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})