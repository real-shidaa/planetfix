import "./itrg.css";
import { db, auth, provider } from "../../firebase.js";
import { collection, addDoc } from "firebase/firestore"; 
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import Navbar from "../../Components/Navbar/Navbar.jsx";







const Intrgt = () => {

  const generateReport = async (answers) => {
    setLoading(true);
  const prompt = `
You are an environmental impact analyst AI. Review this person's lifestyle and tell them:
- How their habits affect the Earth
- Where they are doing well
- How they can improve
- Only use bullet points
- Make use of emojis to make it engaging
-Make it less than 300 words
- Use spaces and line breaks to make it readable
-Rate it from 1-10 based on their impact on the Earth with 1 being the worst and 10 being the best

Here are their answers:
Clothing: ${answers.clothing || "Not provided"}
Transportation: ${answers.transportation || "Not provided"}
Waste Disposal: ${answers.wasteDisposal || "Not provided"}
Food Consumption: ${answers.foodConsumption || "Not provided"}
Occupation: ${answers.Occupation || "Not provided"}
Name: ${answers.name || "Not provided"}

Respond in a friendly and encouraging tone.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No response.";
    setReport(result);
  } catch (err) {
    console.error("OpenAI error:", err);
    alert("Error generating report.");
  }
  setLoading(false);
};
  const questions = [
    { questionNo: 1, question: "What is your name?" },
    { questionNo: 2, category: "clothing", question: "What fabric are you wearing or do you wear on a daily basis?" },
    { questionNo: 3, category: "transportation", question: "What is your usual mode of transportation?" },
    { questionNo: 4, category: "wasteDisposal", question: "How do you dispose of your waste?" },
    { questionNo: 5, category: "foodConsumption", question: "How many times do you eat daily?" },
    { questionNo: 6, category: "Occupation", question: "What is your occupation?" }
  ];
const [report, setReport] = useState("");
  const [user, setUser] = useState(null);
  const [clicksNo, setClicksNo] = useState(0);
  const [buttonLabel, setButtonLabel] = useState("Start");
  const [answers, setAnswers] = useState({});
  const [currentQuestionNo, setCurrentQuestionNo] = useState(null);
  const [loading, setLoading] = useState(false);


  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
      })
      .catch((error) => {
        console.error("Auth error:", error);
      });
  };



const saveAnswersToFirestore = async (user, data) => {
  if (!user || !data || Object.keys(data).length === 0) return;
  try {
    await addDoc(collection(db, "answers"), {
      uid: user.uid,
      displayName: user.displayName,
      ...data,
      timestamp: new Date()
    });
    console.log("✅ Firestore save success");
  } catch (error) {
    console.error("🔥 Firestore error:", error);
  }
};



  const askQuestion = (questionNo) => {
    const question = questions.find(q => q.questionNo === questionNo);
    const textBox = document.getElementById("textBox");
    if (question && textBox) {
      textBox.placeholder = question.question;
      textBox.value = "";
      setCurrentQuestionNo(questionNo);
    }
  };

  const handleClick = () => {
    const textBox = document.getElementById("textBox");
    const input = textBox?.value.trim();

    if (clicksNo === 0) {
      setButtonLabel("Enter");
      askQuestion(1);
      setCurrentQuestionNo(1);
    } else if (clicksNo === 1) {
      if (!input) return;
      const updated = { ...answers, name: input };
      setAnswers(updated);
      saveAnswersToFirestore(user, updated);
      textBox.value = "";
      textBox.placeholder = "Click a category button below to choose what you'll be asked next.";
      setCurrentQuestionNo(null);
    } else if (currentQuestionNo) {
      if (!input) return;
      const currentQuestion = questions.find(q => q.questionNo === currentQuestionNo);
      if (currentQuestion) {
        const key = currentQuestion.category;
        const updated = { ...answers, [key]: input };
        setAnswers(updated);
        saveAnswersToFirestore(user, updated);
        textBox.value = "";
        textBox.placeholder = "You can answer more questions by selecting another category.";
        setCurrentQuestionNo(null);
      }
    }

    setClicksNo(prev => prev + 1);
  };

  const handleCategoryClick = (event) => {
    const categoryMap = {
      clothing: 2,
      transportation: 3,
      wasteDisposal: 4,
      foodConsumption: 5,
      Occupation: 6
    };

    const classList = event.target.classList;
    const category = Object.keys(categoryMap).find(cat => classList.contains(cat));

    if (category) {
      askQuestion(categoryMap[category]);
    }
  };


return (
 <>
     <Navbar user={user} signIn={signIn} />
    <div className="planetBotInterfce">
      <h1 className="h1">
        Meet <span className="yellow">Planet</span><span className="ornge">Bot</span>
      </h1>

      <div className="textbox">
        <textarea id="textBox" placeholder="Press the start button to begin."></textarea>
        <button onClick={handleClick} className="enter">{buttonLabel}</button>
      </div>

      <div className="categories">
        <button onClick={handleCategoryClick} className="category clothing">Clothing</button>
        <button onClick={handleCategoryClick} className="category transportation">Transportation</button>
        <button onClick={handleCategoryClick} className="category wasteDisposal">Waste Disposal</button>
        <button onClick={handleCategoryClick} className="category foodConsumption">Food Consumption</button>
        <button onClick={handleCategoryClick} className="category Occupation">Occupation</button>
      </div>
 {(answers.clothing || answers.transportation || answers.wasteDisposal || answers.foodConsumption || answers.Occupation) && (
  <button onClick={() => generateReport(answers)} className="generate-report">
    Generate Report
  </button>
)}
{loading && <p className="loading">Generating your report... 🌱</p>}

        {report && (
  <div className="report-box">
    <h2>Your Impact Report 🌍</h2>
    {report.split("\n").map((line, idx) =>
      line.trim() !== "" ? <p key={idx}>{line}</p> : <br key={idx} />
    )}
  </div>
)}

    </div>
 </>
);


};

export default Intrgt;
