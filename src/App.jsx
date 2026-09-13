import { useRef, useState } from "react";
import "./App.css";

const API_URL = "https://pdf-rag-system-backend-adw1.onrender.com/";

function App() {

    // ==========================================
    // STATE
    // ==========================================

    const [file, setFile] = useState(null);

    const [question, setQuestion] = useState("");

    const [answer, setAnswer] = useState("");

    const [uploading, setUploading] = useState(false);

    const [asking, setAsking] = useState(false);

    const [status, setStatus] = useState(
        "Default document is active"
    );

    const [activeFile, setActiveFile] = useState(
        "knowledge.pdf"
    );


    // ==========================================
    // REFS
    // ==========================================

    const askSectionRef = useRef(null);

    const textareaRef = useRef(null);


    // ==========================================
    // SELECT PDF
    // ==========================================

    const handleFileChange = (e) => {

        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
            return;
        }


        // Check PDF

        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            alert(
                "Please select a PDF file."
            );

            e.target.value = "";

            return;
        }


        // Check size - 10 MB

        const maxSize =
            10 * 1024 * 1024;

        if (selectedFile.size > maxSize) {

            alert(
                "PDF size must be less than 10 MB."
            );

            e.target.value = "";

            return;
        }


        setFile(selectedFile);

        setStatus(
            "PDF selected and ready to upload"
        );

        setAnswer("");
    };


    // ==========================================
    // UPLOAD PDF
    // ==========================================

    const handleUpload = async () => {

        if (!file) {

            alert(
                "Please select a PDF first."
            );

            return;
        }


        setUploading(true);

        setAnswer("");

        setStatus(
            "Uploading PDF..."
        );


        try {

            // ----------------------------------
            // FormData
            // ----------------------------------

            const formData =
                new FormData();

            formData.append(
                "pdf",
                file
            );


            // ----------------------------------
            // API REQUEST
            // ----------------------------------

            const response =
                await fetch(
                    `${API_URL}/upload`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );


            const data =
                await response.json();


            // ----------------------------------
            // ERROR
            // ----------------------------------

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Upload failed"
                );
            }


            // ----------------------------------
            // SUCCESS
            // ----------------------------------

            setActiveFile(
                data.filename
            );

            setStatus(
                `Active document: ${data.filename}`
            );

            setFile(null);


            // ----------------------------------
            // RESET FILE INPUT
            // ----------------------------------

            const fileInput =
                document.getElementById(
                    "pdf-input"
                );

            if (fileInput) {
                fileInput.value = "";
            }


            // ----------------------------------
            // SMOOTH SCROLL TO ASK SECTION
            // ----------------------------------

            setTimeout(() => {

                askSectionRef.current?.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "center",
                    }
                );


                // ----------------------------------
                // FOCUS TEXTAREA
                // ----------------------------------

                setTimeout(() => {

                    textareaRef.current?.focus();

                }, 600);

            }, 300);

        }


        catch (error) {

            console.error(
                "Upload error:",
                error
            );

            setStatus(
                "Upload failed"
            );

            alert(
                error.message
            );

        }


        finally {

            setUploading(false);

        }

    };


    // ==========================================
    // ASK QUESTION
    // ==========================================

    const handleAsk = async () => {

        if (
            !question.trim() ||
            asking
        ) {
            return;
        }


        setAsking(true);

        setAnswer("");


        try {

            // ----------------------------------
            // API REQUEST
            // ----------------------------------

            const response =
                await fetch(
                    `${API_URL}/ai`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            input:
                                question.trim(),
                        }),
                    }
                );


            const data =
                await response.json();


            // ----------------------------------
            // ERROR
            // ----------------------------------

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Something went wrong"
                );
            }


            // ----------------------------------
            // ANSWER
            // ----------------------------------

            setAnswer(
                data.ai
            );

        }


        catch (error) {

            console.error(
                "Question error:",
                error
            );

            setAnswer(
                "Something went wrong while getting the answer."
            );

        }


        finally {

            setAsking(false);

        }

    };


    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (e) => {

        // Enter = Ask

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            handleAsk();

        }

    };


    // ==========================================
    // CLEAR QUESTION
    // ==========================================

    const clearQuestion = () => {

        setQuestion("");

        textareaRef.current?.focus();

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="app">


            {/* ======================================
                BACKGROUND EFFECTS
            ====================================== */}

            <div className="background-grid"></div>

            <div className="glow glow-one"></div>

            <div className="glow glow-two"></div>


            {/* ======================================
                MAIN CONTAINER
            ====================================== */}

            <main className="container">


                {/* ==================================
                    HEADER
                ================================== */}

                <header className="header">

                    <div className="brand">

                        <div className="brand-icon">
                            ✦
                        </div>

                        <span>
                            DocuMind
                        </span>

                    </div>


                    <div className="badge">
                        <span className="badge-dot"></span>
                        AI • RAG
                    </div>


                    <h1>

                        Chat with your

                        <span>
                            {" "}documents.
                        </span>

                    </h1>


                    <p>

                        Upload a PDF and ask questions.
                        <br />

                        Get answers grounded in your document.

                    </p>

                </header>



                {/* ==================================
                    CURRENT DOCUMENT
                ================================== */}

                <div className="current-document">

                    <div className="document-status">

                        <div className="online-dot"></div>

                        <div>

                            <span className="small-label">
                                CURRENT DOCUMENT
                            </span>

                            <strong>
                                {activeFile}
                            </strong>

                        </div>

                    </div>


                    <div className="document-type">
                        PDF
                    </div>

                </div>



                {/* ==================================
                    UPLOAD CARD
                ================================== */}

                <section className="card upload-card">


                    <div className="card-header">

                        <div>

                            <div className="section-label">
                                DOCUMENT
                            </div>

                            <h2>
                                Upload a PDF
                            </h2>

                            <p>
                                Your new PDF will replace
                                the current document.
                            </p>

                        </div>


                        <div className="card-icon pdf-card-icon">
                            PDF
                        </div>

                    </div>



                    {/* ==================================
                        DROP AREA
                    ================================== */}

                    <div
                        className={`drop-zone ${
                            file
                                ? "has-file"
                                : ""
                        }`}
                    >

                        <div className="upload-circle">

                            <span>
                                ↑
                            </span>

                        </div>


                        <h3>

                            {file
                                ? file.name
                                : "Select your PDF"}

                        </h3>


                        <p>

                            {file
                                ? `${(
                                    file.size /
                                    1024 /
                                    1024
                                ).toFixed(2)} MB • Ready to upload`
                                : "PDF documents up to 10 MB"}

                        </p>


                        <label
                            htmlFor="pdf-input"
                            className="choose-button"
                        >

                            {file
                                ? "Change PDF"
                                : "Choose PDF"}

                            <input
                                id="pdf-input"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={
                                    handleFileChange
                                }
                            />

                        </label>

                    </div>



                    {/* ==================================
                        UPLOAD BUTTON
                    ================================== */}

                    <button
                        className="primary-button upload-button"
                        onClick={
                            handleUpload
                        }
                        disabled={
                            !file ||
                            uploading
                        }
                    >

                        {uploading ? (

                            <>

                                <span className="spinner"></span>

                                <span>
                                    Processing PDF...
                                </span>

                            </>

                        ) : (

                            <>

                                <span>
                                    Upload & Process
                                </span>

                                <span className="button-arrow">
                                    →
                                </span>

                            </>

                        )}

                    </button>



                    {/* ==================================
                        STATUS
                    ================================== */}

                    <div className="status-row">

                        <span className="status-dot"></span>

                        <span>
                            {status}
                        </span>

                    </div>


                </section>



                {/* ==================================
                    ASK AI CARD
                ================================== */}

                <section
                    ref={askSectionRef}
                    className="card question-card"
                >


                    <div className="card-header">

                        <div>

                            <div className="section-label">
                                ASK AI
                            </div>

                            <h2>
                                Ask anything
                            </h2>

                            <p>
                                Ask questions about your
                                active document.
                            </p>

                        </div>


                        <div className="card-icon ai-card-icon">
                            ✦
                        </div>

                    </div>



                    {/* ==================================
                        QUESTION BOX
                    ================================== */}

                    <div className="question-box">

                        <textarea
                            ref={textareaRef}
                            value={question}
                            onChange={(e) =>
                                setQuestion(
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleKeyDown
                            }
                            placeholder="What would you like to know about this document?"
                            rows="5"
                            disabled={asking}
                        />


                        <div className="question-footer">

                            <span className="keyboard-hint">

                                <kbd>
                                    Enter
                                </kbd>

                                to ask

                            </span>


                            <div className="question-actions">


                                {question && (

                                    <button
                                        className="clear-button"
                                        onClick={
                                            clearQuestion
                                        }
                                        disabled={asking}
                                    >
                                        Clear
                                    </button>

                                )}


                                <button
                                    className="ask-button"
                                    onClick={
                                        handleAsk
                                    }
                                    disabled={
                                        asking ||
                                        !question.trim()
                                    }
                                >

                                    {asking ? (

                                        <>

                                            <span className="spinner"></span>

                                            Thinking...

                                        </>

                                    ) : (

                                        <>

                                            Ask AI

                                            <span>
                                                ↗
                                            </span>

                                        </>

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>



                    {/* ==================================
                        ANSWER
                    ================================== */}

                    {answer && (

                        <div className="answer">


                            <div className="answer-header">

                                <div className="answer-title">

                                    <div className="answer-icon">
                                        ✦
                                    </div>

                                    <div>

                                        <span className="answer-label">
                                            AI ANSWER
                                        </span>

                                        <strong>
                                            Response
                                        </strong>

                                    </div>

                                </div>


                                <div className="source-badge">

                                    <span className="source-dot"></span>

                                    From document

                                </div>

                            </div>


                            <div className="answer-content">

                                {answer}

                            </div>


                            <div className="answer-footer">

                                <span>
                                    Generated from your
                                    uploaded document
                                </span>

                            </div>


                        </div>

                    )}

                </section>



                {/* ==================================
                    HOW IT WORKS
                ================================== */}

                <section className="how-it-works">

                    <div className="how-item">

                        <div className="how-number">
                            01
                        </div>

                        <div>

                            <strong>
                                Upload
                            </strong>

                            <span>
                                Add your PDF
                            </span>

                        </div>

                    </div>


                    <div className="how-line"></div>


                    <div className="how-item">

                        <div className="how-number">
                            02
                        </div>

                        <div>

                            <strong>
                                Process
                            </strong>

                            <span>
                                Create embeddings
                            </span>

                        </div>

                    </div>


                    <div className="how-line"></div>


                    <div className="how-item">

                        <div className="how-number">
                            03
                        </div>

                        <div>

                            <strong>
                                Ask
                            </strong>

                            <span>
                                Get grounded answers
                            </span>

                        </div>

                    </div>

                </section>



                {/* ==================================
                    FOOTER
                ================================== */}

                <footer>

                    <span>
                        Powered by
                    </span>

                    <strong>
                        Qdrant
                    </strong>

                    <span className="footer-plus">
                        +
                    </span>

                    <strong>
                        Gemini Embeddings
                    </strong>

                    <span className="footer-plus">
                        +
                    </span>

                    <strong>
                        Gemma
                    </strong>

                </footer>


            </main>

        </div>

    );
}

export default App;
