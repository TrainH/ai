import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin';

export const UserEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput disabled source="email" label="이메일" />
            <TextInput source="name" label="이름" />
            <TextInput source="phone" label="전화번호" />
            <SelectInput source="role" label="권한" choices={[
                { id: 'ROLE_USER', name: '일반 회원' },
                { id: 'ROLE_ADMIN', name: '관리자' },
            ]} />
            <SelectInput source="status" label="상태" choices={[
                { id: 'ACTIVE', name: '정상' },
                { id: 'SUSPENDED', name: '정지' },
                { id: 'DELETED', name: '탈퇴' },
            ]} />
            <TextInput source="adminMemo" label="관리자 메모" multiline rows={4} fullWidth />
        </SimpleForm>
    </Edit>
);
