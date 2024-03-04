import * as vscode from 'vscode';

async function generateJsdoc(code: string) {
    const prompt = `
        Generate a jsdoc for the following JavaScript:\n\n${code}

        ## Output

        - Give only the comment

        ## Example

        function add(a, b) {
            return a + b;
        }

        ->

        /**
         * Returns the sum of two numbers.
         * @param {number} a - The first number.
         * @param {number} b - The second number.
         * @returns {number} The sum of the two numbers.
         */
    `;

    const body = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        method: "post",
        body: JSON.stringify(body)
    });

    if (!res.ok) {
		vscode.window.showErrorMessage("Error fetching Gemini API");
    }

    const data = await res.json() as any;

    const text = data.candidates[0].content.parts[0].text;
    return text;
}

export default generateJsdoc;
