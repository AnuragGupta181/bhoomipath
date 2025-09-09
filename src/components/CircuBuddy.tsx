import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RotateCcw, Download, MessageCircle, Send, SkipForward } from 'lucide-react';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizState, QuizData, QuizPayload } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';

const CircuBuddy = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<'welcome' | 'quiz' | 'chat'>('welcome');
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    isSubmitting: false,
    results: null,
    userGoal: ''
  });

  const startQuiz = () => {
    setMode('quiz');
    setQuizState(prev => ({ ...prev, currentQuestion: 0 }));
  };

  const startChat = () => {
    setMode('chat');
    setChatMessages([{
      role: 'assistant',
      content: "Great! I'm here to help with any LCA questions. Ask me about reducing emissions, circularity options, or anything sustainability-related! 🌱"
    }]);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    
    setTimeout(() => {
      let response = "That's a great question! ";
      if (userMessage.toLowerCase().includes('emission')) {
        response += "To reduce emissions, consider: switching to renewable energy, optimizing transport routes, or exploring circular economy options. Want to model this in a quiz?";
      } else if (userMessage.toLowerCase().includes('circular')) {
        response += "Circularity means keeping materials in use longer. Options include recycling, refurbishing, or remanufacturing. Let's explore this in a quiz!";
      } else {
        response += "I can help you explore this through our LCA quiz. Would you like to start the quiz to model different scenarios?";
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
  };

  const handleAnswer = (questionId: keyof QuizData, value: string | number) => {
    const numericFields = ['Energy_MJ_per_kg', 'Quantity_kg', 'Energy_MJ_total', 'Transport_km', 'Transport_emissions_kgCO2', 'Water_use_m3_per_ton', 'Process_emissions_kgCO2', 'Total_emissions_kgCO2', 'Emission_factor_kgCO2_per_MJ'];
    
    const newAnswers = {
      ...quizState.answers,
      [questionId]: numericFields.includes(questionId) ? (value === '' ? 0 : Number(value)) : value
    };

    // Auto-calculate Energy_MJ_total = Energy_MJ_per_kg × Quantity_kg
    if (questionId === 'Energy_MJ_per_kg' || questionId === 'Quantity_kg') {
      const energyPerKg = questionId === 'Energy_MJ_per_kg' ? Number(value) : (newAnswers.Energy_MJ_per_kg || 0);
      const quantity = questionId === 'Quantity_kg' ? Number(value) : (newAnswers.Quantity_kg || 0);
      newAnswers.Energy_MJ_total = energyPerKg * quantity;
    }

    // Auto-calculate Total_emissions_kgCO2 = Process_emissions_kgCO2 + Transport_emissions_kgCO2
    if (questionId === 'Process_emissions_kgCO2' || questionId === 'Transport_emissions_kgCO2') {
      const processEmissions = questionId === 'Process_emissions_kgCO2' ? Number(value) : (newAnswers.Process_emissions_kgCO2 || 0);
      const transportEmissions = questionId === 'Transport_emissions_kgCO2' ? Number(value) : (newAnswers.Transport_emissions_kgCO2 || 0);
      newAnswers.Total_emissions_kgCO2 = processEmissions + transportEmissions;
    }
    
    setQuizState(prev => ({ ...prev, answers: newAnswers }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizQuestions.length) {
      if (quizState.currentQuestion === quizQuestions.length - 1) {
        setQuizState(prev => ({ ...prev, currentQuestion: quizQuestions.length }));
      } else {
        setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
      }
    } else {
      submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  const skipQuestion = () => {
    const currentQ = quizQuestions[quizState.currentQuestion];
    if (currentQ && currentQ.type === 'number') {
      handleAnswer(currentQ.id, 0);
    }
    nextQuestion();
  };

  const submitQuiz = async () => {
    setQuizState(prev => ({ ...prev, isSubmitting: true }));
    
    const payload: QuizPayload = {
      sample_row: {
        Process_Type: quizState.answers.Process_Type || '',
        Metal: quizState.answers.Metal || '',
        Energy_MJ_per_kg: quizState.answers.Energy_MJ_per_kg || 0,
        Quantity_kg: quizState.answers.Quantity_kg || 0,
        Energy_MJ_total: quizState.answers.Energy_MJ_total || 0,
        Transport_km: quizState.answers.Transport_km || 0,
        Transport_Mode: quizState.answers.Transport_Mode || '',
        Transport_emissions_kgCO2: quizState.answers.Transport_emissions_kgCO2 || 0,
        Water_use_m3_per_ton: quizState.answers.Water_use_m3_per_ton || 0,
        End_of_Life: quizState.answers.End_of_Life || '',
        Circularity_option: quizState.answers.Circularity_option || '',
        Process_emissions_kgCO2: quizState.answers.Process_emissions_kgCO2 || 0,
        Total_emissions_kgCO2: quizState.answers.Total_emissions_kgCO2 || 0,
        Emission_factor_kgCO2_per_MJ: quizState.answers.Emission_factor_kgCO2_per_MJ || 0
      },
      question: quizState.userGoal || 'LCA analysis for metallurgy process'
    };

    try {
      const response = await fetch('https://sih-backend-d411.onrender.com/insights/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const results = await response.json();
      setQuizState(prev => ({ ...prev, isSubmitting: false, results }));
      
      toast({
        title: "Analysis Complete!",
        description: "Your LCA results are ready.",
      });
    } catch (error) {
      setQuizState(prev => ({ ...prev, isSubmitting: false }));
      toast({
        title: "Connection Error",
        description: "Failed to submit. You can retry or export your data.",
        variant: "destructive"
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: {}, isSubmitting: false, results: null, userGoal: '' });
    setMode('welcome');
  };

  // Welcome Screen
  if (mode === 'welcome') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bhoomi-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl bhoomi-text-gradient">Hi, I'm CircuBuddy! 🌱</CardTitle>
            <CardDescription className="text-lg mt-4">
              I help you run Life Cycle Assessments and explore circularity improvements. I can either guide you through a 2-minute quiz or chat freely about LCA. What would you like to do?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-3">
              <Button onClick={startQuiz} className="w-full bhoomi-btn-glow" size="lg">
                Start LCA Quiz
              </Button>
              <Button onClick={startChat} variant="outline" className="w-full" size="lg">
                Chat with me
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Quiz: 15 questions • ~2 minutes • Instant analysis
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chat Mode
  if (mode === 'chat') {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bhoomi-card mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat with CircuBuddy
              </CardTitle>
              <Button onClick={() => setMode('quiz')} variant="outline" size="sm">
                Switch to Quiz
              </Button>
            </CardHeader>
          </Card>
          
          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          <Card className="bhoomi-card">
            <CardContent className="pt-4">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me about LCA, emissions, circularity..."
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  className="flex-1"
                />
                <Button onClick={handleChatSend} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Screen  
  if (quizState.results) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bhoomi-card">
            <CardHeader>
              <CardTitle className="text-2xl bhoomi-text-gradient">🎉 LCA Analysis Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary/10 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap text-foreground">
                  {typeof quizState.results === 'string' ? quizState.results : JSON.stringify(quizState.results, null, 2)}
                </pre>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={() => {const dataStr = JSON.stringify(quizState.answers, null, 2); const dataBlob = new Blob([dataStr], {type: 'application/json'}); const url = URL.createObjectURL(dataBlob); const link = document.createElement('a'); link.href = url; link.download = 'lca-quiz-answers.json'; link.click();}} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button onClick={resetQuiz} variant="secondary">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Mode
  if (mode === 'quiz') {
    const totalQuestions = quizQuestions.length + 1;
    const isGoalQuestion = quizState.currentQuestion === quizQuestions.length;
    const progress = ((quizState.currentQuestion + 1) / totalQuestions) * 100;

    // Goal Question (15th question)
    if (isGoalQuestion) {
      return (
        <div className="min-h-screen bg-background p-4">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Question 15 of 15</span>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="bhoomi-card">
              <CardHeader>
                <CardTitle className="text-xl">What is your goal for this LCA run?</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="e.g., Reduce CO2 emissions by 20%, explore circular economy options..."
                  value={quizState.userGoal}
                  onChange={(e) => setQuizState(prev => ({ ...prev, userGoal: e.target.value }))}
                  className="bhoomi-input min-h-20"
                />

                <div className="flex justify-between items-center pt-4">
                  <Button onClick={() => setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))} variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  
                  <Button onClick={nextQuestion} className="bhoomi-btn-glow" disabled={!quizState.userGoal.trim()}>
                    Get Analysis
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {quizState.isSubmitting && (
              <div className="text-center mt-4">
                <p className="text-primary animate-pulse">🔄 Analyzing your data...</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Regular Quiz Questions
    const currentQ = quizQuestions[quizState.currentQuestion];
    const currentAnswer = quizState.answers[currentQ.id];

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Question {quizState.currentQuestion + 1} of {totalQuestions}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bhoomi-card">
            <CardHeader>
              <CardTitle className="text-xl">{currentQ.title}</CardTitle>
              {currentQ.helper && (
                <CardDescription className="text-sm bg-accent/10 p-3 rounded-lg">
                  💡 {currentQ.helper}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentQ.type === 'select' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options?.map((option) => (
                    <Button
                      key={option}
                      variant={currentAnswer === option ? "default" : "outline"}
                      className={`h-auto p-4 text-left justify-start ${
                        currentAnswer === option ? 'bhoomi-btn-glow' : ''
                      }`}
                      onClick={() => handleAnswer(currentQ.id, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder={currentQ.placeholder}
                    value={currentAnswer || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    className="bhoomi-input text-lg"
                  />
                  {currentQ.unit && (
                    <p className="text-sm text-muted-foreground">Unit: {currentQ.unit}</p>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-2">
                  {quizState.currentQuestion > 0 && (
                    <Button onClick={prevQuestion} variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                  <Button onClick={skipQuestion} variant="ghost" size="sm">
                    <SkipForward className="w-4 h-4 mr-1" />
                    Skip
                  </Button>
                </div>
                
                <Button onClick={nextQuestion} className="bhoomi-btn-glow" disabled={currentQ.required && !currentAnswer}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default CircuBuddy;