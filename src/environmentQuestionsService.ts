import { Injectable } from '@nestjs/common';
import * as environmentQuestions from './data/questions_environment.json';
import * as mitigationQuestions from './data/questions_mitigation.json';
import { shuffle } from 'lodash';

type Question = {
  id: number;
  question: string;
  answers: Answer[];
};

type Answer = {
  id: number;
  answer: string;
  isCorrect: boolean;
};

type SubmittedAnswers = {
  [key: string]: string;
};

@Injectable()
export class EnvironmentQuestionsService {
  questions: Question[] = environmentQuestions;

  #getFiveQuestions(): Question[] {
    const shuffledQuestions = shuffle(this.questions);
    return shuffledQuestions.slice(0, 5).map((question) => {
      const randomQuestion = JSON.parse(JSON.stringify(question));

      randomQuestion.answers.forEach((answer) => {
        delete answer.isCorrect;
      });

      return randomQuestion;
    });
  }

  checkAnswers(submittedAnswers: SubmittedAnswers): number {
    let score = 0;

    this.questions.forEach((question) => {
      const questionId = `question-${question.id}`;
      const submittedAnswer = submittedAnswers[questionId];
      const correctAnswer = question.answers.find((answer) => {
        return answer.answer === submittedAnswer && answer.isCorrect;
      });

      if (correctAnswer) {
        score++;
      }
    });

    return score;
  }

  getQuestions(): Question[] {
    return this.#getFiveQuestions();
  }
}

@Injectable()
export class MitigationQuestionsService extends EnvironmentQuestionsService {
  questions: Question[] = mitigationQuestions;

  checkAnswers(submittedAnswers: SubmittedAnswers): number {
    let score = 0;

    this.questions.forEach((question) => {
      const questionId = `question-${question.id}`;
      const submittedAnswer = submittedAnswers[questionId];
      const correctAnswer = question.answers.find((answer) => {
        return answer.answer === submittedAnswer && answer.isCorrect;
      });

      if (correctAnswer) {
        score++;
      }
    });
    return score;
  }
}
