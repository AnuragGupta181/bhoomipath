import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RotateCcw, Download, MessageCircle } from 'lucide-react';
import { quizQuestions } from '@/data/quizQuestions';
import { QuizState, QuizData, QuizPayload } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';

const CircuBuddy = () => {
  const { toast } = useToast();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: -1, // -1 for welcome screen
    answers: {},
    isSubmitting: false,
    results: null,
    userGoal: ''
  });

  const startQuiz = () => {
    setQuizState(prev => ({ ...prev, currentQuestion: 0 }));
  };

  const goToQuestion = (questionIndex: number) => {
    setQuizState(prev => ({ ...prev, currentQuestion: questionIndex }));
  };

  const handleAnswer = (questionId: keyof QuizData, value: string | number) => {
    const numericFields = ['Energy_MJ_per_kg', 'Quantity_kg', 'Energy_MJ_total', 'Transport_km', 'Transport_emissions_kgCO2', 'Water_use_m3_per_ton', 'Process_emissions_kgCO2', 'Total_emissions_kgCO2', 'Emission_factor_kgCO2_per_MJ'];
    
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: numericFields.includes(questionId) ? (value === '' ? 0 : Number(value)) : value
      }
    }));
  };

  const nextQuestion = () => {
    if (quizState.currentQuestion < quizQuestions.length - 1) {
      setQuizState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
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
    if (currentQ.type === 'number') {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const results = await response.json();
      setQuizState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        results,
        currentQuestion: -2 // Results screen
      }));
      
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

  const exportAnswers = () => {
    const dataStr = JSON.stringify(quizState.answers, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lca-quiz-answers.json';
    link.click();
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: -1,
      answers: {},
      isSubmitting: false,
      results: null,
      userGoal: ''
    });
  };

  // Welcome Screen
  if (quizState.currentQuestion === -1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bhoomi-card">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl bhoomi-text-gradient">Hi! I'm CircuBuddy 🌍</CardTitle>
            <CardDescription className="text-lg mt-4">
              I'm here to help you run Life Cycle Assessment (LCA) quizzes for metallurgy and mining processes. 
              I'll guide you through 14 quick questions about your aluminium, copper, or critical mineral operations 
              to calculate environmental impacts and suggest improvements.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="p-4 bg-accent/20 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>What you'll get:</strong> Detailed CO₂ footprint, water usage analysis, 
                circularity recommendations, and actionable insights for your process.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={startQuiz} className="w-full bhoomi-btn-glow" size="lg">
                Start LCA Quiz
              </Button>
              <div className="text-sm text-muted-foreground">
                Takes ~3 minutes • 14 questions • Instant results
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Results Screen
  if (quizState.currentQuestion === -2) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bhoomi-card">
            <CardHeader>
              <CardTitle className="text-2xl bhoomi-text-gradient">
                🎉 LCA Analysis Complete!
              </CardTitle>
              <CardDescription>
                Here are your environmental impact results and recommendations:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quizState.results ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Analysis Results:</h3>
                    <pre className="text-sm whitespace-pre-wrap text-foreground">
                      {typeof quizState.results === 'string' ? quizState.results : JSON.stringify(quizState.results, null, 2)}
                    </pre>
                  </div>
                  
                  {quizState.results.recommendations && (
                    <div className="p-4 bg-accent/10 rounded-lg">
                      <h3 className="font-semibold text-accent-foreground mb-2">Recommendations:</h3>
                      <ul className="space-y-1 text-sm">
                        {Array.isArray(quizState.results.recommendations) 
                          ? quizState.results.recommendations.map((rec: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{rec}</span>
                              </li>
                            ))
                          : <li>{quizState.results.recommendations}</li>
                        }
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No results available. Please try submitting again.</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={exportAnswers} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button onClick={resetQuiz} variant="secondary">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Analysis
                </Button>
                <Button onClick={() => goToQuestion(0)} variant="ghost">
                  Edit Answers
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Would you like me to (a) run another scenario, (b) change an answer, or (c) export the results?
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Quiz Questions
  const currentQ = quizQuestions[quizState.currentQuestion];
  const progress = ((quizState.currentQuestion + 1) / quizQuestions.length) * 100;
  const currentAnswer = quizState.answers[currentQ.id];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Question {quizState.currentQuestion + 1} of {quizQuestions.length}
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
                  Skip
                </Button>
              </div>
              
              <Button
                onClick={nextQuestion}
                className="bhoomi-btn-glow"
                disabled={currentQ.required && !currentAnswer}
              >
                {quizState.currentQuestion === quizQuestions.length - 1 ? 'Get Results' : 'Next'}
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
};

export default CircuBuddy;