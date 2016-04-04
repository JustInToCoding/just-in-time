// app/routes/application.js
import Ember from 'ember';
export default Ember.Route.extend({
  beforeModel() {
    return this.get('session').fetch().catch(function() {});
  },
  actions: {
    signIn(provider) {
      this.get('session').open('firebase', { provider }).then((data) => {
        console.log(data);
        // On succesfully logged in => save user to database
        let user = this.get('store').createRecord('user', {
          id: data.uid,
          name: data.currentUser.displayName
        });
        user.save().then(() => {
          // Succes
        }, () => {
          // Failed => Close session, because saving to database failed
          this.get('session').close();
        });
      });
    },
    signOut() {
      this.get('session').close();
    }
  }
});
