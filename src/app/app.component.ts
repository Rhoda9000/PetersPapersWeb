import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from './services/data-service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './data/models/User';
import { Department } from './data/models/Department';
import { Task } from './data/models/Task';
import { TaskStatus } from './data/models/TaskStatus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PetersPapersWeb';
  users: User[];
  userForm: FormGroup;
  departments: Department[];
  taskStatuses: TaskStatus[];
  taskForm: FormGroup;
  tasks: FormArray;
  selectedTaskUser: User;
  searchForm: FormGroup;
  destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private dataService: DataService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.getUsers();
    this.getDepartments();
    this.loadUserFormBuilder();
    this.loadTaskFormBuilder();

    this.searchForm = this.formBuilder.group({
      q: ['', [Validators.required]],
    });

    this.searchForm.get('q').valueChanges.subscribe(search => {
     this.search(search)
    })
  }

  loadUserFormBuilder(user?: User) {
    this.userForm = this.formBuilder.group({
      id: [user?.id != null ? user.id : 0],
      firstName: [user?.firstName, [Validators.required]],
      lastName: [user?.lastName, [Validators.required]],
      email: [user?.email, [Validators.required, Validators.email]],
      cellNumber: [
        user?.cellNumber,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],

      departmentId: [user?.departmentId, [Validators.required]],
    });
  }

  search(q: string) {
    this.getUsers(q);
  }

  getUsers(q?: string) {
    this.dataService
      .getUsers(q)
      .pipe(takeUntil(this.destroy))
      .subscribe((data) => {
        this.users = data as User[];
      });
  }

  getDepartments() {
    this.dataService
      .getDepartments()
      .pipe(takeUntil(this.destroy))
      .subscribe((data) => {
        this.departments = data as Department[];
      });
  }

  getTaskStatuses() {
    this.dataService
      .getTaskStatuses()
      .pipe(takeUntil(this.destroy))
      .subscribe((data) => {
        this.taskStatuses = data as TaskStatus[];
      });
  }

  updateUser(user: User) {
    this.loadUserFormBuilder(user);
    (<HTMLElement>document.querySelector('#saveUser')).click();
  }

  deleteUser(user: User) {
    var result = confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
    );
    if (result) {
      this.dataService
        .deleteUser(user.id)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getUsers();
        });
    }
  }

  onUserSubmit() {
    let user = this.userForm.value as User;
    this.dataService
      .saveUser(user)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.getUsers();
        (<HTMLElement>document.querySelector('#modalClose')).click();
        this.loadUserFormBuilder();
      });
  }

  closeModal() {
    this.loadUserFormBuilder();
  }

  get getControl() {
    return this.userForm.controls;
  }

  updateTask(user: User) {
    this.selectedTaskUser = user;
    this.loadTaskFormBuilder();
  }

  loadTaskFormBuilder() {
    this.getTaskStatuses();
    this.taskForm = this.formBuilder.group({
      tasks: this.formBuilder.array([]),
    });

    if (this.selectedTaskUser) {
      this.selectedTaskUser.tasks.forEach((task) => {
        this.tasks = this.taskForm.get('tasks') as FormArray;
        this.tasks.push(this.createTask(task));
      });
    }
  }

  createTask(task?: Task): FormGroup {
    return this.formBuilder.group({
      userId: [this.selectedTaskUser.id],
      id: [task?.id != null ? task.id : 0],
      title: [task?.title, [Validators.required]],
      description: [task?.description, [Validators.required]],
      dueDate: [task?.dueDate, [Validators.required]],
      taskStatusId: [task?.taskStatusId, [Validators.required]],
    });
  }

  addTask(): void {
    this.tasks = this.taskForm.get('tasks') as FormArray;
    this.tasks.push(this.createTask());
  }

  get getTaskControl() {
    return this.taskForm.get('tasks') as FormArray;
  }

  onTaskSubmit() {
    this.dataService
      .saveTasks(this.taskForm.value.tasks)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.getUsers();
        (<HTMLElement>document.querySelector('#taskModalClose')).click();
        this.loadTaskFormBuilder();
      });
  }

  deleteTask(task: Task, index: number) {
    if (task.id == 0) {
      this.getTaskControl.removeAt(index);
    } else {
      this.dataService
        .deleteTask(task.id)
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          this.getUsers();
        });
      this.getTaskControl.removeAt(index);
    }
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
}
