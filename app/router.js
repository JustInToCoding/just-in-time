import Router from 'ember-router';
import config from './config/environment';

const router = Router.extend({
  location: config.locationType
});

router.map(function() {
  this.route('tasks', function() {
    this.route('index');
    this.route('new');
  });
});

export default router;
