import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { Recommendation } from '@prisma/client';

describe('Recommendation Service', () => {

  it('deve inserir uma recomendação', async () => {
    const recommendation = {
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1'
    } as Recommendation;

    jest.spyOn(recommendationRepository, 'findByName').mockImplementationOnce(() : any => {});
    jest.spyOn(recommendationRepository, 'create').mockImplementationOnce(() : any => {});

    await recommendationService.insert(recommendation);

    expect(recommendationRepository.findByName).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.create).toHaveBeenCalledTimes(1);
  });

  it('não deve inserir uma recomendação com nome já existente', async () => {
    const recommendation = {
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1'
    } as Recommendation;

    jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce({
        name: 'Teste',
        youtubeLink: 'https://www.youtube.com/watch?v=1',
        id: 1,
        score: 0
      });

    const promise = recommendationService.insert(recommendation);

    expect(promise).rejects.toEqual({
      type: 'conflict', 
      message: 'Recommendations names must be unique'
    });
  });

  it('deve conseguir realizar um upvote de uma recomendação existente', async () => {

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1',
      id: 1,
      score: 0
    });
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce(() : any => {});

    await recommendationService.upvote(1);

    expect(recommendationRepository.find).toHaveBeenCalledTimes(1);
    expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1);
  });

  it('deve conseguir realizar um downvote de uma recomendação existente', async () => {
      
      jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
        name: 'Teste',
        youtubeLink: 'https://www.youtube.com/watch?v=1',
        id: 1,
        score: 0
      });
      jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
        name: 'Teste',
        youtubeLink: 'https://www.youtube.com/watch?v=1',
        id: 1,
        score: -1
      });
  
      await recommendationService.downvote(1);
  
      expect(recommendationRepository.find).toBeCalled();
      expect(recommendationRepository.updateScore).toBeCalled();
  });	

  it('não deve conseguir realizar um upvote de uma recomendação inexistente', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(() : any => {});

    const promise = recommendationService.upvote(1);

    expect(promise).rejects.toEqual({type: 'not_found', message: ''});
  });

  it('não deve conseguir realizar um downvote de uma recomendação inexistente', async () => {
    jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(() : any => {});

    const promise = recommendationService.downvote(1);

    expect(promise).rejects.toEqual({type: 'not_found', message: ''});
  });

  it('deve remover uma recomendação com score menor que -5', async () => {
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce({
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1',
      id: 1,
      score: -5
    });

    jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1',
      id: 1,
      score: -6
    });

    jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce(() : any => {});

    await recommendationService.downvote(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it('deve retornar todas as recomendações', async () => {
    jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(() : any => {});

    await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
  })

  it('deve retornar as 5 recomendações com maior score', async () => {	
    jest.spyOn(recommendationRepository, 'getAmountByScore').mockImplementationOnce(() : any => {});

    await recommendationService.getTop(5);

    expect(recommendationRepository.getAmountByScore).toBeCalled();
  })

  it('deve retornar uma recomendação aleatória com pontuação maior que 10', async () => {

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.8);
    
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([{
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1',
      id: 1,
      score: 11
    }]);

    const recommendation = await recommendationService.getRandom();

    expect(recommendation.score).toBeGreaterThan(10);

  })

  it('deve retornar not_found caso nao existam recomendacoes ', async () => {

    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

    const promise = await recommendationService.getRandom();
    console.log("AAAAAAAAAA", promise)
    expect(promise).toEqual({type: 'not_found', message: ''});
  })

  it('deve retornar uma recomendação aleatória com pontuação menor que 10', async () => {

    jest.spyOn(Math, 'random').mockReturnValueOnce(0.5);
    
    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([{
      name: 'Teste',
      youtubeLink: 'https://www.youtube.com/watch?v=1',
      id: 1,
      score: 9
    }]);

    const recommendation = await recommendationService.getRandom();

    expect(recommendation.score).toBeLessThan(10);

  })

})