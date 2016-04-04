import Route from 'ember-route';

export default Route.extend({
  actions: {
    newTask() {
      let newTask = this.store.createRecord('task', {
        title: this.get('controller').get('title'),
        completed: false
      });
      newTask.save().then(() => {
        this.get('controller').set('title', '');
        this.transitionTo('tasks.index');
        // TODO: Saved
      }, () => {
        // TODO: Failed
      });
    }
  }
});
