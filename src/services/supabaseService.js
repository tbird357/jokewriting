import { supabase } from '../config/supabaseConfig';

export const jokeService = {
  async saveJoke(jokeData) {
    const { data, error } = await supabase
      .from('jokes')
      .upsert({
        id: jokeData.id || undefined,
        title: jokeData.title || '',
        premise: jokeData.premise || '',
        punchline: jokeData.punchline || '',
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) {
      console.error('Save joke error:', error);
      throw new Error(`Failed to save joke: ${error.message}`);
    }
    return data || { ...jokeData, id: data?.id };
  },

  async getJoke(id) {
    const { data, error } = await supabase
      .from('jokes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Get joke error:', error);
      throw new Error(`Failed to get joke: ${error.message}`);
    }
    return data;
  },

  async getJokes() {
    const { data, error } = await supabase
      .from('jokes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Get jokes error:', error);
      throw new Error(`Failed to get jokes: ${error.message}`);
    }
    return { data };
  },

  async deleteJoke(id) {
    const { error } = await supabase
      .from('jokes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete joke error:', error);
      throw new Error(`Failed to delete joke: ${error.message}`);
    }
    return true;
  },

  async getJokeWithReferences(id) {
    const { data: joke, error: jokeError } = await supabase
      .from('jokes')
      .select('*')
      .eq('id', id)
      .single();

    if (jokeError) {
      console.error('Get joke error:', jokeError);
      throw new Error(`Failed to get joke: ${jokeError.message}`);
    }

    const { data: references, error: referencesError } = await supabase
      .from('joke_references')
      .select('*')
      .eq('joke_id', id);

    if (referencesError) {
      console.error('Get references error:', referencesError);
      throw new Error(`Failed to get references: ${referencesError.message}`);
    }

    return {
      ...joke,
      references: references || []
    };
  }
};

export const referenceService = {
  async saveReference(jokeId, type, item) {
    const { data, error } = await supabase
      .from('joke_references')
      .insert([{ 
        joke_id: jokeId,
        type, 
        item,
        elaboration: ''
      }]);

    if (error) {
      console.error('Save reference error:', error);
      throw new Error(`Failed to save reference: ${error.message}`);
    }
    return data;
  },

  async updateElaboration(referenceId, elaboration) {
    const { data, error } = await supabase
      .from('joke_references')
      .update({ elaboration })
      .eq('id', referenceId)
      .select();

    if (error) {
      console.error('Update elaboration error:', error);
      throw new Error(`Failed to update elaboration: ${error.message}`);
    }
    return data;
  },

  async getReferences(jokeId) {
    const { data, error } = await supabase
      .from('joke_references')
      .select('*')
      .eq('joke_id', jokeId);

    if (error) {
      console.error('Get references error:', error);
      throw new Error(`Failed to get references: ${error.message}`);
    }
    return data || [];
  },

  async deleteReference(id) {
    const { error } = await supabase
      .from('joke_references')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete reference error:', error);
      throw new Error(`Failed to delete reference: ${error.message}`);
    }
    return true;
  }
}; 