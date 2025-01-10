const path = require('path');
const { exec } = require('child_process');

const fastify = require('fastify')({ logger: true });
const fastFormbody = require('@fastify/formbody');
const fastView = require('@fastify/view');
const fastStatic = require('@fastify/static');
const fastCookie = require('@fastify/cookie');
const fastSession = require('@fastify/session');

const dotenv = require('dotenv');
dotenv.config();

const { testMailer, getMailer } = require('./mailer.js');

const {
    getDatabases,
    createDatabase,
    saveTemplate,
    getTemplate,
    updateTemplate,
    getAllTemplates,
    deleteTemplate
} = require('./templates.js');

// Register plugins
fastify.register(fastFormbody);
fastify.register(fastCookie);
fastify.register(fastSession, {
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false }
});
fastify.register(fastView, {
    engine: {
        ejs: require('ejs')
    },
    root: 'views'
});
fastify.register(fastStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/pub/'
});

// Pre-handler hook to check SMTP configuration and set flash messages
fastify.addHook('preHandler', (request, reply, done) => {
    if (!testMailer()) {
        return reply.status(500).send({ error: 'SMTP server not configured. Rename the .env-example file as .env, and update the values.' });
    }

    reply.locals = {
        flashMessage: request.session.flashMessage
    };

    delete request.session.flashMessage;

    done();
});

// Route to render database creation form
fastify.get('/database/create', async (request, reply) => {
    return reply.view('database_create.ejs');
});

// Route to handle database creation
fastify.post('/database/create', async (request, reply) => {
    try {
        const { dbName } = request.body;
        await createDatabase(dbName);
        request.session.flashMessage = 'Database created successfully. Create a template';
        return reply.redirect(`/templates/create?dbName=${dbName}`);
    } catch (error) {
        request.session.flashMessage = 'That database already exists';
        return reply.redirect('/database/create');
    }
});

// Route to list all templates
fastify.get('/templates', async (request, reply) => {
    try {
        const databases = await getDatabases();
        if (!databases.length) {
            request.session.flashMessage = 'You must first create a database';
            return reply.redirect('/database/create');
        }
        const templates = await getAllTemplates();
        return reply.view('template_list.ejs', { templates, databases });
    } catch (error) {
        request.session.flashMessage = 'Failed to load templates';
        return reply.redirect('/');
    }
});

// Route to render template creation form
fastify.get('/templates/create', async (request, reply) => {
    const { dbName } = request.query;
    if (!dbName) {
        request.session.flashMessage = 'You must choose a database to create template in';
        return reply.redirect('/templates');
    }
    return reply.view('template_create.ejs', { dbName });
});

// Route to handle template creation
fastify.post('/templates/create', async (request, reply) => {
    const { dbName, subject, body } = request.body;
    if (!dbName || !subject || !body) {
        request.session.flashMessage = 'Invalid input';
        return reply.redirect('/templates/create');
    }
    try {
        await saveTemplate(dbName, subject, body);
        request.session.flashMessage = 'Template created';
        return reply.redirect(`/templates`);
    } catch (error) {
        console.log(error);
        request.session.flashMessage = 'Failed to create template';
        return reply.redirect(`/templates/create?dbName=${dbName}`);
    }
});

// Route to render template edit form
fastify.get('/templates/edit/:dbName/:id', async (request, reply) => {
    const { dbName, id } = request.params;
    try {
        const template = await getTemplate(dbName, id);
        return reply.view('template_edit.ejs', { template, dbName });
    } catch (error) {
        request.session.flashMessage = 'Template not found';
        return reply.redirect(`/templates`);
    }
});

// Route to handle template update
fastify.post('/templates/edit/:dbName/:id', async (request, reply) => {
    const { subject, body } = request.body;
    const { dbName, id } = request.params;
    if (!subject || !body) {
        return reply.status(400).send({ error: 'Invalid input' });
    }
    try {
        await updateTemplate(dbName, id, subject, body);
        request.session.flashMessage = 'Template updated';
        return reply.redirect(`/templates`);
    } catch (error) {
        request.session.flashMessage = 'Failed to update template';
        return reply.redirect(`/templates/${dbName}/${id}`);
    }
});

// Route to handle template deletion
fastify.post('/templates/delete/:dbName/:id', async (request, reply) => {
    const { dbName, id } = request.params;
    try {
        await deleteTemplate(dbName, id);
        request.session.flashMessage = 'Template deleted';
        return reply.redirect(`/templates/${dbName}`);
    } catch (error) {
        request.session.flashMessage = 'Failed to delete template';
        return reply.redirect(`/templates/${dbName}/${id}`);
    }
});

// Route to send email using a template
fastify.post('/send', async (request, reply) => {
    const { body } = request;
    const { to, templateId } = body;
    const [dbName, id] = templateId.split('-');
    try {
        const template = await getTemplate(dbName, id);
        if (!template) {
            return reply.status(404).send({ error: 'Template not found' });
        }

        const mailer = getMailer();

        const mailOptions = {
            from: process.env.FROM_ADDRESS || process.env.SMTP_USER,
            to,
            subject: template.subject.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, key) => body[`variables[${key}]`] || ''),
            html: template.body.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, key) => body[`variables[${key}]`] || '')
        };

        await mailer.sendMail(mailOptions);
        request.session.flashMessage = 'Email sent';
        return reply.redirect('/');
    } catch (error) {
        request.session.flashMessage = `Could not send email. ${error.message}`;
        return reply.redirect('/');
    }
});

// Route to render the main page
fastify.get('/', async (request, reply) => {
    try {
        const templates = await getAllTemplates();
        if (!Object.keys(templates).length) {
            request.session.flashMessage = 'You must first create a template';
            return reply.redirect('/templates');
        }
        return reply.view('send_email.ejs', { templates });
    } catch (error) {
        reply.status(500).send({ error: 'Failed to load app' });
    }
});

// Start the server
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await fastify.listen({
            port
        });
        openBrowser(`http://localhost:${port}`);
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

// Function to open the browser with the given URL
function openBrowser(url) {
    const platform = process.platform;

    let command;

    if (platform === 'win32') {
        command = `start "" "${url}"`;
    } else if (platform === 'darwin') {
        command = `open "${url}"`;
    } else if (platform === 'linux') {
        command = `xdg-open "${url}"`;
    } else {
        console.error('Unsupported platform');
        return;
    }

    exec(command, (err) => {
        if (err) {
            console.error(`Failed to open browser: ${err.message}`);
        }
    });
}
