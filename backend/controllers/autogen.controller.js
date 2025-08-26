const { OpenAI } = require('openai');
const fs = require('fs');
const markdownIt = require('markdown-it');
const puppeteer = require('puppeteer');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const selectRandomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}
const answer = async (req, res) => {
    const { applicant, job, note } = req.body;
    const { name, email, phone, address, education, experience } = applicant
    const { title, description } = job
    const sentence1 = `
     render the resume in markdown format, use appropriate markdown syntax for headings, lists, and emphasis.
    I want to make a resume to apply for the job titled "${title}".
    The job description is as follows: ${description}
    Here is a note about resume : ${note}
    ${name ? `name is ` + name : ""}, 
    ${email ? `email is ` + email : ""}, 
    ${phone ? `phone is ` + phone : ""}, 
    ${address ? `address is ` + address : ""}.
    ${education ? `education is ` + education : ""}.
    ${experience ? `experience is ` + experience : ""}
   `;
    openai.responses.create({
        model: "gpt-5-nano",
        input: sentence1
    }).then(async (response) => {
        console.log(response.output_text);
        const mdText = response.output_text;
        const md = new markdownIt();
        const htmlContent = md.render(mdText);
        const html = `
        <html>
            <head>
                <style>
                    body { 
                        font-family: ${selectRandomElement('Arial, sans-serif', 'Georgia, serif', 'Helvetica, sans-serif', 'Times New Roman, serif', 'Verdana, sans-serif')}; 
                        padding: ${selectRandomElement('25px', '30px', '20px', '15px')}; 
                        font-size: ${selectRandomElement('11px', '12px', '13px', '15px')}; 
                        line-height: 1.6; 
                        margin: 0; 
                    }
                    h1 {
                        text-align: 'center'; 
                        color: ${selectRandomElement('#2e6c80ff', '#4a90e2ff', '#26584dff', '#9013feff', '#74511aff')}; 
                        margin-bottom: ${selectRandomElement('25px', '30px', '20px', '15px')};
                        page-break-after: avoid;}
                     h2 { 
                        color: ${selectRandomElement('#2e6c80ff', '#232f3dff', '#26584dff', '#2c1a3cff', '#372303ff')}; 
                        page-break-after: avoid; 
                        text-align :center;
                    }
                    h3 { 
                        color: ${selectRandomElement('#186b87ff', '#3e628bff', '#13372fff', '#9013feff', '#75664dff')}; 
                        page-break-after: avoid; 
                        text-align :center;
                    }
                    h4 { 
                        color: ${selectRandomElement('#081f26ff', '#828384ff', '#5f6161ff', '#474747ff', '#726e68ff')}; 
                        page-break-after: avoid; 
                        text-align :center;
                    }
                    pre { 
                        background: ${selectRandomElement('#2e6c80ff', '#4a90e2ff', '#26584dff', '#9013feff', '#74511aff')}; 
                        padding: 10px; 
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                    }
                    /* Proper page break rules */
                    .page-break { 
                        page-break-before: always; 
                        break-before: page; 
                    }
                    /* Ensure padding is respected after page breaks */
                    @page { 
                        margin: 25px; 
                    }
                </style>
            </head>
            <body>${htmlContent}</body>
        </html>
        `;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '25mm', right: '25mm', bottom: '25mm', left: '25mm' },
            printBackground: true
        });
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
        res.send(pdfBuffer);
    }).catch((error) => {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: error.message });
    });
}
module.exports = {
    answer,
};