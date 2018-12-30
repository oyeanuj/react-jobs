'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var React = require('react')
var React__default = _interopDefault(React)
var PropTypes = _interopDefault(require('prop-types'))

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i]

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }

    return target
  }

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass,
    )
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var objectWithoutProperties = function(obj, keys) {
  var target = {}

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue
    target[i] = obj[i]
  }

  return target
}

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called",
    )
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

var isPromise = function isPromise(x) {
  return (
    (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' &&
    typeof x.then === 'function'
  )
}

var propsWithoutInternal = function propsWithoutInternal(props) {
  // eslint-disable-next-line no-unused-vars
  var jobInitState = props.jobInitState,
    onJobProcessed = props.onJobProcessed,
    rest = objectWithoutProperties(props, ['jobInitState', 'onJobProcessed'])

  return rest
}

var validSSRModes = ['resolve', 'defer', 'boundary']
var neverWorkAgain = function neverWorkAgain() {
  return false
}

function withJob(config) {
  if (
    (typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object'
  ) {
    throw new Error('You must provide a config object to withJob')
  }

  var work = config.work,
    LoadingComponent = config.LoadingComponent,
    ErrorComponent = config.ErrorComponent,
    _config$serverMode = config.serverMode,
    serverMode =
      _config$serverMode === undefined ? 'resolve' : _config$serverMode,
    _config$shouldWorkAga = config.shouldWorkAgain,
    shouldWorkAgain =
      _config$shouldWorkAga === undefined
        ? neverWorkAgain
        : _config$shouldWorkAga,
    _config$onlyUseWrappe = config.onlyUseWrappedComponent,
    onlyUseWrappedComponent =
      _config$onlyUseWrappe === undefined ? false : _config$onlyUseWrappe

  if (typeof work !== 'function') {
    throw new Error('You must provide a work function to withJob')
  }

  if (validSSRModes.indexOf(serverMode) === -1) {
    throw new Error('Invalid serverMode provided to asyncComponent')
  }

  var env = typeof window === 'undefined' ? 'node' : 'browser'

  return function wrapWithJob(WrappedComponent) {
    var id = void 0

    var ComponentWithJob = (function(_Component) {
      inherits(ComponentWithJob, _Component)

      function ComponentWithJob(props, context) {
        classCallCheck(this, ComponentWithJob)

        // Each instance needs it's own id as that is how we expect work to
        // be executed.  It is not shared between element instances.
        var _this = possibleConstructorReturn(
          this,
          (
            ComponentWithJob.__proto__ ||
            Object.getPrototypeOf(ComponentWithJob)
          ).call(this, props, context),
        )

        _initialiseProps.call(_this)

        if (context.jobs) {
          id = context.jobs.getNextId()
        }
        return _this
      }

      // @see react-async-bootstrapper

      createClass(ComponentWithJob, [
        {
          key: 'bootstrap',
          value: function bootstrap() {
            if (env === 'browser') {
              // No logic for browser, just continue
              return true
            }

            // node
            return serverMode === 'defer' ? false : this.resolveWork(this.props)
          },
        },
        {
          key: 'componentWillMount',
          value: function componentWillMount() {
            var result = void 0

            if (this.context.jobs) {
              result =
                env === 'browser'
                  ? this.context.jobs.getRehydrate(id)
                  : this.context.jobs.get(id)
            }

            this.setState({
              data: result ? result.data : null,
              error: null,
              completed: result != null,
            })
          },
        },
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            if (!this.state.completed) {
              this.resolveWork(this.props)
            }

            if (this.context.jobs && env === 'browser') {
              this.context.jobs.removeRehydrate(id)
            }
          },
        },
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            this.unmounted = true
          },
        },
        {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps, nextContext) {
            var _context = this.context,
              store = _context.store,
              intl = _context.intl

            if (
              shouldWorkAgain(
                propsWithoutInternal(this.props),
                propsWithoutInternal(nextProps),
                this.getJobState(),
                { store: store, intl: intl },
                { store: nextContext.store, intl: nextContext.intl },
              )
            ) {
              this.resolveWork(nextProps)
            }
          },
        },
        {
          key: 'render',
          value: function render() {
            var _state = this.state,
              data = _state.data,
              error = _state.error,
              completed = _state.completed

            if (onlyUseWrappedComponent) {
              return React__default.createElement(
                WrappedComponent,
                _extends({}, this.props, { jobState: this.state }),
              )
            }

            if (error) {
              return ErrorComponent
                ? React__default.createElement(
                    ErrorComponent,
                    _extends({}, this.props, { error: error }),
                  )
                : null
            }

            if (!completed) {
              return LoadingComponent
                ? React__default.createElement(LoadingComponent, this.props)
                : null
            }

            return React__default.createElement(
              WrappedComponent,
              _extends({}, this.props, { jobResult: data }),
            )
          },
        },
      ])
      return ComponentWithJob
    })(React.Component)

    ComponentWithJob.displayName =
      'WithJob(' + getDisplayName(WrappedComponent) + ')'
    ComponentWithJob.contextTypes = {
      jobs: PropTypes.shape({
        getNextId: PropTypes.func.isRequired,
        register: PropTypes.func.isRequired,
        get: PropTypes.func.isRequired,
        getRehydrate: PropTypes.func.isRequired,
        removeRehydrate: PropTypes.func.isRequired,
      }),
      store: PropTypes.object,
      intl: PropTypes.object,
    }

    var _initialiseProps = function _initialiseProps() {
      var _this2 = this

      this.resolveWork = function(props) {
        var workDefinition = void 0

        _this2.setState({ completed: false, data: null, error: null })
        var _context2 = _this2.context,
          store = _context2.store,
          intl = _context2.intl

        try {
          workDefinition = work(props, { store: store, intl: intl })
        } catch (error) {
          _this2.setState({ completed: true, error: error })
          // Ensures bootstrap stops
          return false
        }

        if (isPromise(workDefinition)) {
          // Asynchronous result.
          return workDefinition
            .then(function(data) {
              if (_this2.unmounted) {
                return undefined
              }
              _this2.setState({ completed: true, data: data })
              _this2.setJobContext(data)
              // Ensures bootstrap continues
              return true
            })
            .catch(function(error) {
              if (_this2.unmounted) {
                return undefined
              }
              if (env === 'browser') {
                setTimeout(function() {
                  if (!_this2.unmounted) {
                    _this2.setState({ completed: true, error: error })
                  }
                }, 16)
              } else {
                // node
                // We will at least log the error so that user isn't completely
                // unaware of an error occurring.
                // eslint-disable-next-line no-console
                console.warn('Failed to resolve job')
                // eslint-disable-next-line no-console
                console.warn(error)
              }
              // Ensures bootstrap stops
              return false
            })
        }

        // Synchronous result.
        _this2.setJobContext(workDefinition)

        _this2.setState({ completed: true, data: workDefinition, error: null })

        // Ensures bootstrap continues
        return true
      }

      this.setJobContext = function(data) {
        if (_this2.context.jobs) {
          _this2.context.jobs.register(id, { data: data })
        }
      }

      this.getJobState = function() {
        return {
          completed: _this2.state.completed,
          error: _this2.state.error,
          data: _this2.state.data,
        }
      }
    }

    return ComponentWithJob
  }
}

function createJobContext() {
  var idPointer = 0
  var jobs = {}
  return {
    getNextId: function getNextId() {
      idPointer += 1
      return idPointer
    },
    resetIds: function resetIds() {
      idPointer = 0
    },
    register: function register(jobID, result) {
      jobs[jobID] = result
    },
    get: function get(jobID) {
      return jobs[jobID]
    },
    getState: function getState() {
      return { jobs: jobs }
    },
  }
}

var JobProvider = (function(_Component) {
  inherits(JobProvider, _Component)

  function JobProvider(props, context) {
    classCallCheck(this, JobProvider)

    // This is a workaround because each element instance of a job needs its
    // own ids.  So between the bootstrapping and the render we need to reset
    // the id counter to ensure the ids will match.
    var _this = possibleConstructorReturn(
      this,
      (JobProvider.__proto__ || Object.getPrototypeOf(JobProvider)).call(
        this,
        props,
        context,
      ),
    )

    if (props.jobContext) {
      props.jobContext.resetIds()
    }
    return _this
  }

  createClass(JobProvider, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        this.jobContext = this.props.jobContext || createJobContext()
        this.rehydrateState = this.props.rehydrateState
      },
    },
    {
      key: 'getChildContext',
      value: function getChildContext() {
        var _this2 = this

        return {
          jobs: {
            getNextId: this.jobContext.getNextId,
            register: this.jobContext.register,
            get: this.jobContext.get,
            getRehydrate: function getRehydrate(id) {
              return _this2.rehydrateState.jobs[id]
            },
            removeRehydrate: function removeRehydrate(id) {
              delete _this2.rehydrateState.jobs[id]
            },
          },
        }
      },
    },
    {
      key: 'render',
      value: function render() {
        return React__default.Children.only(this.props.children)
      },
    },
  ])
  return JobProvider
})(React.Component)

JobProvider.propTypes = {
  children: PropTypes.node.isRequired,
  jobContext: PropTypes.shape({
    getNextId: PropTypes.func.isRequired,
    resetIds: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
  rehydrateState: PropTypes.shape({
    jobs: PropTypes.object.isRequired,
  }),
}
JobProvider.defaultProps = {
  jobContext: null,
  rehydrateState: {
    jobs: {},
  },
}
JobProvider.childContextTypes = {
  jobs: PropTypes.shape({
    getNextId: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    getRehydrate: PropTypes.func.isRequired,
    removeRehydrate: PropTypes.func.isRequired,
  }).isRequired,
}

exports.withJob = withJob
exports.JobProvider = JobProvider
exports.createJobContext = createJobContext
//# sourceMappingURL=react-jobs.js.map
