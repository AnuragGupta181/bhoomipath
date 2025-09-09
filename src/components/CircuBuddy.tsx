import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Download, MessageCircle, Send, SkipForward } from 'lucide-react';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizState, QuizData, QuizPayload } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];
  questionId?: keyof QuizData | string;
  questionType?: 'select' | 'number';
  unit?: string;
  allowSkip?: boolean;
}

const CircuBuddy = () => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: {},
    isSubmitting: false,
    results: null,
    userGoal: ''
  });
  const [isQuestionMode, setIsQuestionMode] = useState(true);

  // Initialize chat with intro and first question
  useEffect(() => {
    const introMessage: ChatMessage = {
      role: 'assistant',
      content: "Hi, I'm CircuBuddy! 🌱 I'll help you run a Life Cycle Assessment through a quick 15-question chat. Let's start!"
    };
    
    setChatMessages([introMessage]);
    
    // Start first question after brief delay
    setTimeout(() => {
      askNextQuestion(0);
    }, 1000);
  }, []);

  const askNextQuestion = (questionIndex: number) => {
    const totalQuestions = quizQuestions.length + 1; // +1 for goal question
    
    if (questionIndex >= quizQuestions.length) {
      // Ask goal question
      const goalMessage: ChatMessage = {
        role: 'assistant',
        content: `Question ${questionIndex + 1} of ${totalQuestions}: What is your goal for this LCA run?`,
        questionId: 'userGoal' as keyof QuizData,
        questionType: 'number', // Using number type for text area
        allowSkip: false
      };
      setChatMessages(prev => [...prev, goalMessage]);
      return;
    }

    const question = quizQuestions[questionIndex];
    const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);
    
    const questionMessage: ChatMessage = {
      role: 'assistant',
      content: `Question ${questionIndex + 1} of ${totalQuestions} (${progress}% complete): ${question.title}`,
      options: question.options,
      questionId: question.id,
      questionType: question.type,
      unit: question.unit,
      allowSkip: !question.required
    };

    setChatMessages(prev => [...prev, questionMessage]);
  };

  const handleAnswer = (questionId: keyof QuizData | string, value: string | number) => {
    if (questionId === 'userGoal') {
      setQuizState(prev => ({ ...prev, userGoal: value as string }));
      setChatMessages(prev => [...prev, { role: 'user', content: value as string }]);
      submitQuiz();
      return;
    }

    const numericFields = ['Energy_MJ_per_kg', 'Quantity_kg', 'Energy_MJ_total', 'Transport_km', 'Transport_emissions_kgCO2', 'Water_use_m3_per_ton', 'Process_emissions_kgCO2', 'Total_emissions_kgCO2', 'Emission_factor_kgCO2_per_MJ'];
    
    const newAnswers = {
      ...quizState.answers,
      [questionId]: numericFields.includes(questionId) ? (value === '' ? 0 : Number(value)) : value
    };

    // Auto-calculate Energy_MJ_total = Energy_MJ_per_kg × Quantity_kg
    if (questionId === 'Energy_MJ_per_kg' || questionId === 'Quantity_kg') {
      const energyPerKg = questionId === 'Energy_MJ_per_kg' ? Number(value) : (newAnswers.Energy_MJ_per_kg || 0);
      const quantity = questionId === 'Quantity_kg' ? Number(value) : (newAnswers.Quantity_kg || 0);
      if (energyPerKg && quantity) {
        newAnswers.Energy_MJ_total = energyPerKg * quantity;
      }
    }

    // Auto-calculate Total_emissions_kgCO2 = Process_emissions_kgCO2 + Transport_emissions_kgCO2
    if (questionId === 'Process_emissions_kgCO2' || questionId === 'Transport_emissions_kgCO2') {
      const processEmissions = questionId === 'Process_emissions_kgCO2' ? Number(value) : (newAnswers.Process_emissions_kgCO2 || 0);
      const transportEmissions = questionId === 'Transport_emissions_kgCO2' ? Number(value) : (newAnswers.Transport_emissions_kgCO2 || 0);
      if (processEmissions || transportEmissions) {
        newAnswers.Total_emissions_kgCO2 = processEmissions + transportEmissions;
      }
    }

    setQuizState(prev => ({ ...prev, answers: newAnswers }));
    setChatMessages(prev => [...prev, { role: 'user', content: String(value) }]);
    
    // Move to next question
    const nextQuestion = quizState.currentQuestion + 1;
    setQuizState(prev => ({ ...prev, currentQuestion: nextQuestion }));
    
    setTimeout(() => {
      askNextQuestion(nextQuestion);
    }, 500);
  };

  const handleSkip = () => {
    const currentQ = quizQuestions[quizState.currentQuestion];
    if (currentQ?.type === 'number') {
      handleAnswer(currentQ.id, 0);
    } else {
      setChatMessages(prev => [...prev, { role: 'user', content: 'Skipped' }]);
      const nextQuestion = quizState.currentQuestion + 1;
      setQuizState(prev => ({ ...prev, currentQuestion: nextQuestion }));
      setTimeout(() => {
        askNextQuestion(nextQuestion);
      }, 500);
    }
  };

  const submitQuiz = async () => {
    setQuizState(prev => ({ ...prev, isSubmitting: true }));
    setChatMessages(prev => [...prev, { role: 'assistant', content: '🔄 Analyzing your data...' }]);
    
    const payload: QuizPayload = {
      sample_row: {
        Process_Type: quizState.answers.Process_Type || '',
        Metal: quizState.answers.Metal || '',
        Energy_MJ_per_kg: quizState.answers.Energy_MJ_per_kg || 0,
        Quantity_kg: quizState.answers.Quantity_kg || 0,
        Energy_MJ_total: quizState.answers.Energy_MJ_total || null,
        Transport_km: quizState.answers.Transport_km || 0,
        Transport_Mode: quizState.answers.Transport_Mode || '',
        Transport_emissions_kgCO2: quizState.answers.Transport_emissions_kgCO2 || null,
        Water_use_m3_per_ton: quizState.answers.Water_use_m3_per_ton || 0,
        End_of_Life: quizState.answers.End_of_Life || '',
        Circularity_option: quizState.answers.Circularity_option || '',
        Process_emissions_kgCO2: quizState.answers.Process_emissions_kgCO2 || null,
        Total_emissions_kgCO2: quizState.answers.Total_emissions_kgCO2 || null,
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
      
      const resultMessage = typeof results === 'string' ? results : JSON.stringify(results, null, 2);
      setChatMessages(prev => [...prev, 
        { role: 'assistant', content: '🎉 Analysis Complete!' },
        { role: 'assistant', content: resultMessage }
      ]);
      
      toast({
        title: "Analysis Complete!",
        description: "Your LCA results are ready.",
      });
    } catch (error) {
      setQuizState(prev => ({ ...prev, isSubmitting: false }));
      setChatMessages(prev => [...prev, 
        { role: 'assistant', content: '❌ Network error. Would you like to retry or export your data?' }
      ]);
      toast({
        title: "Connection Error",
        description: "Failed to submit. You can retry or export your data.",
        variant: "destructive"
      });
    }
  };

  const resetQuiz = () => {
    setQuizState({ currentQuestion: 0, answers: {}, isSubmitting: false, results: null, userGoal: '' });
    setChatMessages([]);
    setTimeout(() => {
      const introMessage: ChatMessage = {
        role: 'assistant',
        content: "Let's start a new LCA analysis! 🌱"
      };
      setChatMessages([introMessage]);
      setTimeout(() => {
        askNextQuestion(0);
      }, 1000);
    }, 500);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(quizState.answers, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lca-quiz-answers.json';
    link.click();
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    // Handle free-form chat if not in question mode
    if (!isQuestionMode) {
      const userMessage = chatInput.trim();
      setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setChatInput('');
      
      setTimeout(() => {
        let response = "That's a great question! ";
        if (userMessage.toLowerCase().includes('emission')) {
          response += "To reduce emissions, consider: switching to renewable energy, optimizing transport routes, or exploring circular economy options.";
        } else if (userMessage.toLowerCase().includes('circular')) {
          response += "Circularity means keeping materials in use longer through recycling, refurbishing, or remanufacturing.";
        } else {
          response += "I can help you explore this through our LCA analysis.";
        }
        
        setChatMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bhoomi-card mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bhoomi-text-gradient">
              <MessageCircle className="w-5 h-5" />
              CircuBuddy LCA Assistant
            </CardTitle>
          </CardHeader>
        </Card>
        
        <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                
                {/* Show options for select questions */}
                {msg.role === 'assistant' && msg.options && (
                  <div className="mt-3 space-y-2">
                    {msg.options.map((option) => (
                      <Button
                        key={option}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => msg.questionId && handleAnswer(msg.questionId, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Show input for number questions */}
                {msg.role === 'assistant' && msg.questionType === 'number' && !msg.options && msg.questionId !== 'userGoal' && (
                  <div className="mt-3 space-y-2">
                    <Input
                      type="number"
                      placeholder="Enter value"
                      className="text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const value = (e.target as HTMLInputElement).value;
                          if (msg.questionId) handleAnswer(msg.questionId, value);
                        }
                      }}
                    />
                    {msg.unit && <p className="text-xs text-muted-foreground">Unit: {msg.unit}</p>}
                  </div>
                )}
                
                {/* Show textarea for goal question */}
                {msg.role === 'assistant' && msg.questionId === 'userGoal' && (
                  <div className="mt-3 space-y-2">
                    <Textarea
                      placeholder="e.g., Reduce CO2 emissions by 20%, explore circular economy options..."
                      className="text-sm min-h-16"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const value = (e.target as HTMLTextAreaElement).value;
                          if (value.trim()) handleAnswer('userGoal', value);
                        }
                      }}
                    />
                  </div>
                )}
                
                {/* Show skip button for skippable questions */}
                {msg.role === 'assistant' && msg.allowSkip && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSkip}
                      className="text-xs"
                    >
                      <SkipForward className="w-3 h-3 mr-1" />
                      Skip
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Show action buttons after results */}
        {quizState.results && (
          <Card className="bhoomi-card">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={exportData} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button onClick={resetQuiz} variant="secondary" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Free-form chat input (only show if not in active question flow) */}
        {!isQuestionMode && (
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
        )}
      </div>
    </div>
  );
};

export default CircuBuddy;