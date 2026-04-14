import { CharacterState } from '../store/characterStore';
import { fetchCharacter as dbFetchCharacter, saveCharacter as dbSaveCharacter } from './dbService';

export interface ICharacterRepository {
  /**
   * Loads a character by ID.
   * Useful for initial load when no local cache exists, or to refresh from the source of truth.
   */
  getCharacter(id: string): Promise<any>;
  
  /**
   * Saves or exports a character to the remote backend (currently simulated).
   */
  saveCharacter(id: string, data: any): Promise<void>;

  /**
   * Instantiates or imports character data from an external source (e.g. JSON file).
   */
  importCharacter(jsonData: string): Promise<any>;
}

/**
 * Local implementation of the character repository.
 * Simulates network delays and provides an offline-first capability.
 * This class isolates the storage logic (localStorage / mock JSON) from the Zustand store.
 */
class LocalCharacterRepository implements ICharacterRepository {
  async getCharacter(id: string): Promise<any> {
    // For now we wrap the existing dbService function to keep compatibility
    // In a real backend, this would make a fetch() call to an API.
    return dbFetchCharacter(id);
  }

  async saveCharacter(id: string, data: any): Promise<void> {
    // In a real backend, this would POST/PUT to an API.
    return dbSaveCharacter(id, data);
  }

  async importCharacter(jsonData: string): Promise<any> {
    try {
      const data = JSON.parse(jsonData);
      // Further validation could be added here to ensure data matches CharacterState structure
      if (!data.identity || !data.stats) {
        throw new Error("Le fichier ne contient pas les données valides d'un personnage.");
      }
      return data;
    } catch (e) {
      throw new Error(`Erreur lors de l'import : ${(e as Error).message}`);
    }
  }
}

export const characterRepository = new LocalCharacterRepository();
