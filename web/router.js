import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from './views/layout.vue';
import Login from './views/login.vue';
import Management from './views/index.vue';

Vue.use(VueRouter);


class Router {
  constructor() {


    const routes = [
      {
        path: '/',
        redirect: 'management',
        component: Layout,
        children: [
          {
            path: 'management',
            name: 'Management',
            component: Management,
            meta: {
              allowAnonymous: false
            }
          },
          {
            path: 'login',
            name: 'Login',
            component: Login,
            meta: {
              allowAnonymous: true
            }
          },
        ],
      },
    ];

    // configure router
    const router = new VueRouter({
      routes,
      linkActiveClass: 'active',
      mode: 'history'
    });

    router.beforeEach(async (to, from, next) => {
      if (!to.matched.some((x) => x.meta.allowAnonymous)) {

      }
      next();
    })
    return router;
  }
}

export default Router;