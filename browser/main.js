import { Editor } from './CKEditor';

createVariableForm();
updateEmailPreview();

addEventListener(document, 'change', createVariableForm, '[name="templateId"]');
addEventListener(document, 'keyup', updateEmailPreview, '[name^="variables"]');
addEventListener(document, 'change', updateEmailPreview, '[name="templateId"]');

function addEventListener(el, eventName, eventHandler, selector) {
    if (selector) {
        const wrappedHandler = (e) => {
            if (!e.target) return;
            const el = e.target.closest(selector);
            if (el) {
                eventHandler.call(el, e);
            }
        };

        el.addEventListener(eventName, wrappedHandler);

        return wrappedHandler;
    } else {
        const wrappedHandler = (e) => {
            eventHandler.call(el, e);
        };
      
        el.addEventListener(eventName, wrappedHandler);

        return wrappedHandler;
    }
}

function createVariableForm() {
    const element = document.querySelector('[name="templateId"]');

    if (!element) {
        return;
    }

    const [dbName, templateId] = element.value.split('-');
    const template = window.templates[dbName].find(t => t.id == templateId);

    if (template) {
        const variablesDiv = document.getElementById('variables');
        variablesDiv.innerHTML = '<hr>';

        const variableMatches = template.body.match(/\{\{\s*(.*?)\s*\}\}/g);

        if (variableMatches) {
            variableMatches.forEach(variable => {
                const variableName = variable.replace(/[{}]+/g, '');
                variablesDiv.innerHTML += `
                    <div class="row">
                        <div class="col-2 text-end fw-bold">
                            ${variableName}:
                        </div>
                        <div class="col-10">
                            <input type="text" class="form-control" id="${variableName}" name="variables[${variableName}]" required>
                        </div>
                    </div>
                `;
            });
        }
    }
}

function updateEmailPreview() {
    const emailPreviewSubject = document.getElementById('email-preview-subject');
    const emailPreviewBody = document.getElementById('email-preview-body');

    if (!emailPreviewSubject || !emailPreviewBody) {
        return;
    }

    const [dbName, templateId] = document.querySelector('[name="templateId"]').value.split('-');
    const template = window.templates[dbName].find(t => t.id == templateId);

    if (template) {
        const variables = Array.from(document.querySelectorAll('[name^="variables"]')).reduce((acc, el) => {
            acc[el.name] = el.value;
            return acc;
        }, {});

        emailPreviewSubject.innerHTML = template.subject;
        emailPreviewBody.innerHTML = template.body;

        Object.entries(variables).forEach(([key, value]) => {
            const actualKey = key.replace('variables[', '').replace(']', '');
            emailPreviewSubject.innerHTML = emailPreviewSubject.innerHTML.replace(new RegExp(`\{\{${actualKey}\}\}`, 'g'), value);
            emailPreviewBody.innerHTML = emailPreviewBody.innerHTML.replace(new RegExp(`\{\{${actualKey}\}\}`, 'g'), value);
        });
    }
}

document.querySelectorAll('[data-editor]').forEach((element) => {
    Editor(element).then((editor) => {
        editor.model.document.on('change:data', () => {
            element.value = editor.getData();
        });
    });
});
